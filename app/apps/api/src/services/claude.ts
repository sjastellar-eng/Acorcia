import Anthropic from '@anthropic-ai/sdk'
import type { SessionPhase, ProjectDraft } from '@soc/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── DISCOVERY SESSION SYSTEM PROMPT ──────────────────────────

const DISCOVERY_SYSTEM_PROMPT = `You are the Source Constructor AI companion — a thoughtful, warm guide that helps people discover what they truly want to build.

Your role is to conduct a structured Discovery Session across 5 phases:
1. CONTEXT — Understand their current situation (3-5 questions)
2. VALUES — Uncover what truly matters to them (3-5 questions)
3. DESIRES — Surface genuine desires vs "should" desires (3-5 questions)
4. CONSTRAINTS — Understand realistic constraints (2-3 questions)
5. SYNTHESIS — Summarize and generate their project

CRITICAL PRINCIPLES:
- Never accept surface answers. If someone says "I want to make money", ask what they'd do with the money.
- Always follow curiosity. When something resonates (they use stronger language, more detail, more energy), go deeper.
- Distinguish between "I want this" and "I think I should want this". Gently probe this distinction.
- Never suggest specific project ideas until phase 5. Let it emerge organically.
- Average response: 2-4 sentences. One question at a time. Never multiple questions in one message.
- Be warm but not sycophantic. Don't say "Great!" or "Wonderful!" after every answer.
- If the user gives a one-word answer, reflect it back and ask them to expand.

PHASE TRANSITIONS:
- Move to next phase when you have sufficient signal (not necessarily after N questions)
- When transitioning, briefly acknowledge what you've learned: "I'm starting to see a theme here..."
- You must complete all 5 phases before generating a project

CURRENT PHASE TRACKING:
You will receive the current phase in the system context. Stay in your current phase.`

const PHASE_PROMPTS: Record<SessionPhase, string> = {
  context: 'You are in PHASE 1: CONTEXT. Focus on understanding their current life, work, and what\'s been on their mind.',
  values: 'You are in PHASE 2: VALUES. Focus on what truly matters to them, what makes them feel alive, what they\'d regret not doing.',
  desires: 'You are in PHASE 3: DESIRES. Focus on distinguishing genuine desires from "should" desires. Probe for what excites them vs what sounds good.',
  constraints: 'You are in PHASE 4: CONSTRAINTS. Focus on realistic constraints: time available, skills, financial needs, life situation.',
  synthesis: 'You are in PHASE 5: SYNTHESIS. Summarize everything you\'ve learned and transition to project generation.',
  complete: 'The session is complete.',
}

// ── STREAM A SESSION RESPONSE ─────────────────────────────────

export interface StreamSessionParams {
  messages: { role: 'user' | 'assistant'; content: string }[]
  currentPhase: SessionPhase
  onToken: (token: string) => void
  onComplete: (fullText: string) => Promise<void>
}

export async function streamSessionResponse(params: StreamSessionParams) {
  const { messages, currentPhase, onToken, onComplete } = params

  const systemPrompt = `${DISCOVERY_SYSTEM_PROMPT}\n\n${PHASE_PROMPTS[currentPhase]}`

  let fullText = ''

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      const token = chunk.delta.text
      fullText += token
      onToken(token)
    }
  }

  await onComplete(fullText)
  return fullText
}

// ── DETERMINE PHASE TRANSITION ────────────────────────────────

const PHASE_ORDER: SessionPhase[] = [
  'context',
  'values',
  'desires',
  'constraints',
  'synthesis',
  'complete',
]

export async function shouldTransitionPhase(
  messages: { role: string; content: string }[],
  currentPhase: SessionPhase
): Promise<boolean> {
  if (currentPhase === 'complete') return false

  // Count AI messages in current phase (rough heuristic)
  const aiMessages = messages.filter((m) => m.role === 'assistant')
  const minMessages = currentPhase === 'constraints' ? 2 : 3

  if (aiMessages.length < minMessages) return false

  // Ask Claude if it's time to transition
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 10,
    system: `You are analyzing a Discovery Session. Respond ONLY with "yes" or "no".`,
    messages: [
      {
        role: 'user',
        content: `Current phase: ${currentPhase}. Here are the last ${messages.length} messages. Has this phase gathered sufficient information to move on? Messages: ${JSON.stringify(messages.slice(-6))}`,
      },
    ],
  })

  const answer = (response.content[0] as { text: string }).text.trim().toLowerCase()
  return answer === 'yes'
}

export function getNextPhase(currentPhase: SessionPhase): SessionPhase {
  const idx = PHASE_ORDER.indexOf(currentPhase)
  return PHASE_ORDER[Math.min(idx + 1, PHASE_ORDER.length - 1)]
}

// ── GENERATE SESSION SUMMARY ──────────────────────────────────

export async function generateSessionSummary(
  messages: { role: string; content: string }[]
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: `You are analyzing a completed Discovery Session. Extract the key themes, desires, values, and constraints that emerged. Write a 3-5 sentence narrative summary of what this person truly wants to build and why. Focus on the emotional truth, not just surface statements.`,
    messages: [
      {
        role: 'user',
        content: `Here is the complete session transcript:\n\n${messages
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n\n')}`,
      },
    ],
  })

  return (response.content[0] as { text: string }).text
}

// ── GENERATE PROJECT FROM SESSION ─────────────────────────────

export async function generateProject(
  sessionSummary: string,
  messages: { role: string; content: string }[]
): Promise<ProjectDraft> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    system: `You are generating a structured project plan from a Discovery Session. Output ONLY valid JSON matching the specified schema. No markdown, no explanation, just the JSON object.`,
    messages: [
      {
        role: 'user',
        content: `Based on this Discovery Session summary and transcript, generate a structured project plan.

Summary: ${sessionSummary}

Full transcript (last 10 exchanges):
${messages
  .slice(-20)
  .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
  .join('\n\n')}

Generate a JSON object with this exact structure:
{
  "name": "Project name (3-5 words, memorable)",
  "tagline": "One sentence describing what and for whom",
  "description": "2-3 sentences on the vision and impact",
  "targetUser": "Specific description of who this serves",
  "monetizationModel": "How this generates income (be specific)",
  "timelineWeeks": <number, 8-16>,
  "timeCommitmentWeekly": <hours per week as number>,
  "phases": [
    {
      "title": "Phase name",
      "description": "What happens in this phase",
      "startWeek": 1,
      "endWeek": 4,
      "milestones": [
        { "title": "Milestone title", "description": "What completing this means", "weekOffset": 2 }
      ]
    }
  ],
  "firstWeekTasks": [
    { "title": "Specific task", "priority": "high" }
  ],
  "coreInsights": [
    { "content": "Key insight about this person from the session", "theme": "teaching|autonomy|impact|etc" }
  ]
}

Rules:
- 3-4 phases total
- 2-3 milestones per phase
- 4-6 first week tasks (very specific, immediately actionable)
- 3-5 core insights (quote their words when possible)
- Project must feel PERSONAL to this user, not generic`,
      },
    ],
  })

  const jsonText = (response.content[0] as { text: string }).text
  return JSON.parse(jsonText) as ProjectDraft
}

// ── DAILY COMPANION RESPONSE ──────────────────────────────────

export interface CompanionContext {
  userName: string
  projectName: string
  projectDay: number
  lastCheckinDate: string | null
  lastCommittedTask: string | null
  lastTaskResult: string | null
  recentBlockers: string[]
  sessionInsights: string[]
  suggestedNextTask: string | null
  currentStreak: number
}

export async function generateCompanionResponse(
  context: CompanionContext,
  userMessage: string
): Promise<string> {
  const systemPrompt = `You are ${context.userName}'s Source Constructor daily companion. You know their project well and have been tracking their progress.

Project: ${context.projectName} (Day ${context.projectDay})
Current streak: ${context.currentStreak} days
Last check-in: ${context.lastCheckinDate ?? 'none yet'}
Last committed task: ${context.lastCommittedTask ?? 'none'}
Last result: ${context.lastTaskResult ?? 'not reported'}
Recurring blockers: ${context.recentBlockers.join(', ') || 'none noted'}

Core insights from their Discovery Session:
${context.sessionInsights.slice(0, 3).map((i) => `- ${i}`).join('\n')}

Your style:
- Warm but direct
- Reference specific things they've told you
- One question at a time
- If they accomplished their task: genuine but brief celebration, then next task
- If they didn't: non-judgmental curiosity about what happened
- Keep responses under 100 words
- Always end with a specific suggested task for today (use: ${context.suggestedNextTask ?? 'their next project task'})`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  return (response.content[0] as { text: string }).text
}

// ── EXTRACT INSIGHTS ──────────────────────────────────────────

export async function extractInsights(
  checkinHistory: string[]
): Promise<{ content: string; theme: string }[]> {
  if (checkinHistory.length < 3) return []

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: 'Extract 1-3 meaningful insights from these check-ins. Output JSON array: [{"content": "insight text", "theme": "theme_name"}]',
    messages: [
      {
        role: 'user',
        content: `Check-ins:\n${checkinHistory.join('\n')}`,
      },
    ],
  })

  try {
    return JSON.parse((response.content[0] as { text: string }).text)
  } catch {
    return []
  }
}
