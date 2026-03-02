// Source Constructor — Shared App Logic

// ─────────────────────────────────────────────────────────────────
// STATE (simulated localStorage-based state management)
// ─────────────────────────────────────────────────────────────────

const SOC = {
  state: {
    user: {
      name: 'Alex',
      email: 'alex@example.com',
      plan: 'pro',
      joined: '2026-02-01',
      streak: 7,
    },
    session: null,
    projects: [
      {
        id: 'p1',
        name: 'Запуск консалтинг-практики',
        icon: '🎯',
        category: 'КАРЬЕРА',
        vision: 'Стать независимым продукт-консультантом для стартапов. Работать с 3–5 клиентами одновременно, зарабатывая больше при большей свободе.',
        why: 'Это напрямую отражает твоё главное стремление к автономии + мастерству. Ты уже делаешь это бесплатно для друзей — пора монетизировать.',
        progress: 35,
        status: 'active',
        startDate: '2026-02-15',
        milestones: [
          { id: 'm1', title: 'Определить нишу и ICP', done: true, date: '2026-02-22' },
          { id: 'm2', title: 'Запустить личный сайт/LinkedIn', done: true, date: '2026-03-01' },
          { id: 'm3', title: 'Первые 3 discovery call', done: false, date: '2026-03-15' },
          { id: 'm4', title: 'Закрыть первого клиента', done: false, date: '2026-04-01' },
        ],
        tasks: [
          { id: 't1', title: 'Написать свой "story" для LinkedIn', done: true, priority: 'high' },
          { id: 't2', title: 'Отправить 20 personalised DMs', done: false, priority: 'high' },
          { id: 't3', title: 'Записать 10-минутное видео о подходе', done: false, priority: 'medium' },
          { id: 't4', title: 'Создать шаблон контракта', done: false, priority: 'low' },
        ],
        insights: [
          { text: 'Ты уже 5 дней подряд работаешь над этим. Так держать!', date: '2026-03-01' },
          { text: 'Две выполненные задачи из четырёх на этой неделе — отличный прогресс.', date: '2026-02-28' },
        ],
      },
      {
        id: 'p2',
        name: 'Open-source библиотека для React',
        icon: '⚡',
        category: 'МАСТЕРСТВО',
        vision: 'Создать и опубликовать React-библиотеку которую будут использовать другие разработчики. Первые 100 stars на GitHub.',
        why: 'Помнишь как говорил что чувствовал себя живым, когда программировал ночью для open-source? Это и есть твой flow state.',
        progress: 12,
        status: 'active',
        startDate: '2026-03-01',
        milestones: [
          { id: 'm5', title: 'Определить концепцию и API', done: true, date: '2026-03-05' },
          { id: 'm6', title: 'MVP версия (работающая)', done: false, date: '2026-03-20' },
          { id: 'm7', title: 'Документация и README', done: false, date: '2026-03-27' },
          { id: 'm8', title: 'Публикация на npm + ProductHunt', done: false, date: '2026-04-03' },
        ],
        tasks: [
          { id: 't5', title: 'Написать первый компонент', done: true, priority: 'high' },
          { id: 't6', title: 'Настроить TypeScript + тесты', done: false, priority: 'high' },
          { id: 't7', title: 'Нарисовать архитектуру', done: false, priority: 'medium' },
        ],
        insights: [],
      }
    ],
    checkins: [
      { date: '2026-03-01', mood: 4, projectId: 'p1', notes: 'Написал первое холодное письмо. Страшно, но сделал.', ai_response: 'Это важный шаг. Первое письмо — самое трудное. Как ощущения после отправки?' },
      { date: '2026-02-29', mood: 3, projectId: 'p1', notes: 'Ничего особенного сегодня. Поработал над профилем LinkedIn.', ai_response: 'Даже "ничего особенного" — это прогресс. Что сделал с профилем?' },
      { date: '2026-02-28', mood: 5, projectId: 'p1', notes: 'Закончил личный сайт! Наконец-то.', ai_response: 'Поздравляю! Это важная веха. Сайт — это твоё лицо. Поделишься ссылкой?', milestone: true },
    ],
    trueDesires: [
      { icon: '🎯', name: 'АВТОНОМИЯ', priority: 1, description: 'Ты 8 раз упомянул желание "решать самому". Свобода важнее стабильности.', confidence: 94 },
      { icon: '🔥', name: 'МАСТЕРСТВО', priority: 2, description: 'Загораешься когда говоришь про сложные задачи. Хочешь быть лучшим.', confidence: 87 },
      { icon: '🤝', name: 'ПРИЗНАНИЕ', priority: 3, description: 'Избегаешь слово "признание", но хочешь чтобы работу видели и ценили.', confidence: 72 },
    ]
  },

  // ─── Helpers ───────────────────────────────────────────────────

  getProject(id) {
    return this.state.projects.find(p => p.id === id);
  },

  getTodaysCheckin() {
    const today = new Date().toISOString().split('T')[0];
    return this.state.checkins.find(c => c.date === today);
  },

  getStreakCount() {
    return this.state.user.streak;
  },

  getOverallProgress() {
    if (!this.state.projects.length) return 0;
    const total = this.state.projects.reduce((acc, p) => acc + p.progress, 0);
    return Math.round(total / this.state.projects.length);
  },

  // ─── Toast Notification ─────────────────────────────────────────

  showToast(message, type = 'default', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ─── Navigation Helpers ─────────────────────────────────────────

  navigate(url) {
    window.location.href = url;
  },

  // ─── Format Helpers ─────────────────────────────────────────────

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  },

  formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Сегодня';
    if (diff === 1) return 'Вчера';
    if (diff < 7) return `${diff} дня назад`;
    return this.formatDate(dateStr);
  },

  // ─── Simulated AI Responses ─────────────────────────────────────

  async simulateAIResponse(userMessage, context = '') {
    await this.delay(1200 + Math.random() * 800);
    return this._generateContextualResponse(userMessage, context);
  },

  _generateContextualResponse(input, context) {
    const lowerInput = input.toLowerCase();

    // Check-in responses
    if (context === 'checkin') {
      if (lowerInput.includes('сделал') || lowerInput.includes('написал') || lowerInput.includes('закончил')) {
        return 'Отлично! Конкретное действие — это и есть прогресс. Что было самым трудным сегодня?';
      }
      if (lowerInput.includes('ничего') || lowerInput.includes('не успел')) {
        return 'Бывает. Не каждый день должен быть продуктивным. Что помешало, и как завтра сделать иначе?';
      }
      if (lowerInput.includes('устал') || lowerInput.includes('сложно')) {
        return 'Слышу тебя. Усталость — сигнал что работаешь. Что сейчас нужно — пауза или маленький шаг вперёд?';
      }
      return 'Понял. Какой один маленький шаг можешь сделать завтра, чтобы продвинуться чуть дальше?';
    }

    // Discovery session responses
    if (context === 'discovery') {
      return this._discoveryResponse(input);
    }

    return 'Интересно. Расскажи подробнее — что за этим стоит?';
  },

  _discoveryResponse(input) {
    const responses = [
      'Интересно. Ты употребил слово "должен" — но чего ты хочешь на самом деле, без "должен"?',
      'Когда ты это делаешь — это приносит энергию или забирает её?',
      'Если убрать мнение других людей из уравнения — что бы изменилось в твоём ответе?',
      'Ты сказал это уверенно или скорее как то, что принято говорить?',
      'Что было бы по-другому в твоей жизни, если бы ты уже делал это прямо сейчас?',
      'Когда последний раз ты делал что-то подобное и не думал о времени?',
      'Что тебя пугает в этом больше всего — провал или успех?',
      'Если бы твои лучшие друзья описывали тебя через 5 лет, как бы они это сделали?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};

// ─────────────────────────────────────────────────────────────────
// DOM UTILITIES
// ─────────────────────────────────────────────────────────────────

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') el.className = value;
    else if (key === 'style') Object.assign(el.style, value);
    else if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

// ─────────────────────────────────────────────────────────────────
// ACTIVE NAV HIGHLIGHT
// ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });
});
