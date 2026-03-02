# Financial Model — Source Constructor

> 3-летняя финансовая модель | Март 2026
> Все суммы в USD. Консервативный сценарий.

---

## TAB 1: ASSUMPTIONS (Ключевые допущения)

### Рост пользователей

| Период | Метод роста | Новых users/месяц |
|--------|-----------|-----------------|
| Мес. 1–3 | Organic + waitlist | 50–100 |
| Мес. 4–6 | Alpha outreach | 100–200 |
| Мес. 7–9 | Paid acquisition старт | 300–600 |
| Мес. 10–12 | Product Hunt + SEO | 600–1,200 |
| Year 2 | Scaled paid + referral | 2,000–4,000/мес |
| Year 3 | B2B + partnerships | 5,000–10,000/мес |

### Конверсии и удержание

| Параметр | Значение | Обоснование |
|----------|---------|------------|
| Free → Pro conversion | 8% | Benchmark SaaS freemium: 3–10% |
| Pro → Coach upgrade | 5% | Аналог: Notion Pro → Business |
| Monthly churn (Pro) | 6% | Benchmark consumer SaaS: 5–8% |
| Monthly churn (Coach) | 3% | Высокая ценность, высокая лояльность |
| Referral rate | 15% | 15% пользователей приводят 1 друга |
| Discovery Session completion | 65% | Пилот показал 83%, консервативно 65% |

### Цены

| Тариф | Цена/мес | Цена/год (скидка 20%) |
|-------|---------|---------------------|
| Free | $0 | $0 |
| Pro | $19 | $182 |
| Coach | $79 | $758 |
| B2B (per company) | $416/мес | $5,000/год |

### Стоимость привлечения (CAC) по каналам

| Канал | CAC | % трафика Year 1 |
|-------|-----|-----------------|
| Organic / SEO | $5 | 40% |
| Social Paid (Meta) | $28 | 25% |
| Referral | $8 | 20% |
| Influencer | $22 | 10% |
| Other | $15 | 5% |
| **Blended CAC** | **$14.50** | |

*Примечание: blended CAC по всем users. CAC только для платящих = $35 в Year 1*

### AI API Costs

| Параметр | Значение |
|----------|---------|
| Discovery Session (полная) | $0.08 |
| Daily check-in | $0.02 |
| Project generation | $0.05 |
| Avg sessions/user/month | 8 |
| **Avg AI cost/user/month** | **$0.50** |

---

## TAB 2: REVENUE MODEL

### Monthly Revenue Breakdown (Year 1)

| Месяц | Free Users | Pro Users | Coach Users | Pro MRR | Coach MRR | Total MRR |
|-------|-----------|-----------|-------------|---------|-----------|----------|
| 1 | 80 | 0 | 0 | $0 | $0 | $0 |
| 2 | 180 | 6 | 0 | $114 | $0 | $114 |
| 3 | 310 | 20 | 1 | $380 | $79 | $459 |
| 4 | 480 | 38 | 2 | $722 | $158 | $880 |
| 5 | 680 | 58 | 3 | $1,102 | $237 | $1,339 |
| 6 | 920 | 82 | 4 | $1,558 | $316 | $1,874 |
| 7 | 1,250 | 112 | 6 | $2,128 | $474 | $2,602 |
| 8 | 1,650 | 148 | 8 | $2,812 | $632 | $3,444 |
| 9 | 2,100 | 190 | 10 | $3,610 | $790 | $4,400 |
| 10 | 2,680 | 242 | 13 | $4,598 | $1,027 | $5,625 |
| 11 | 3,350 | 302 | 16 | $5,738 | $1,264 | $7,002 |
| 12 | 4,150 | 376 | 20 | $7,144 | $1,580 | **$8,724** |

**Year 1 Total ARR: ~$91,200**

### Annual Revenue Summary

| | Year 1 | Year 2 | Year 3 |
|-|--------|--------|--------|
| Pro subscribers (EoY) | 376 | 3,200 | 13,600 |
| Coach subscribers (EoY) | 20 | 300 | 800 |
| B2B clients | 0 | 5 | 25 |
| **Pro MRR (EoY)** | $7,144 | $60,800 | $258,400 |
| **Coach MRR (EoY)** | $1,580 | $23,700 | $63,200 |
| **B2B MRR (EoY)** | $0 | $2,080 | $10,400 |
| **Total MRR (EoY)** | **$8,724** | **$86,580** | **$332,000** |
| **ARR** | **$91,200** | **$939,000** | **$3,900,000** |

---

## TAB 3: COST STRUCTURE

### Monthly Fixed Costs

| Статья | Мес. 1–4 | Мес. 5–8 | Мес. 9–12 | Year 2 | Year 3 |
|--------|---------|---------|---------|--------|--------|
| CEO Salary | $5,000 | $6,000 | $7,000 | $8,500 | $10,000 |
| CTO Salary | $7,000 | $7,500 | $8,000 | $9,500 | $12,000 |
| Designer | — | $5,000 | $5,500 | $6,500 | $8,000 |
| Growth Marketer | — | — | $4,500 | $5,500 | $7,000 |
| Customer Success | — | — | — | $4,500 | $5,500 |
| Infrastructure | $500 | $800 | $1,200 | $2,500 | $5,000 |
| SaaS Tools | $800 | $1,000 | $1,500 | $2,000 | $3,000 |
| Legal/Accounting | $1,500 | $1,500 | $2,000 | $2,500 | $3,500 |

### Variable Costs (per month)

| Статья | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| AI API | $35–420 | $420–3,500 | $3,500–10,000 |
| Payment processing (Stripe 2.9%) | $20–253 | $253–2,500 | $2,500–9,600 |
| Marketing (paid) | $0–8,000 | $8,000–18,000 | $18,000–35,000 |
| Contractor / agency | $5,000–10,000 | $3,000–8,000 | $0–5,000 |

---

## TAB 4: P&L (3-Year Projection)

### Годовая P&L

| | Year 1 | Year 2 | Year 3 |
|-|--------|--------|--------|
| **Revenue** | | | |
| Subscription Revenue | $85,200 | $720,000 | $3,100,800 |
| B2B Revenue | $0 | $25,000 | $125,000 |
| Affiliate/Other | $6,000 | $53,000 | $59,000 |
| **Total Revenue** | **$91,200** | **$798,000** | **$3,284,800** |
| | | | |
| **COGS** | | | |
| AI API Costs | $8,400 | $42,000 | $120,000 |
| Payment Processing | $2,600 | $23,100 | $95,300 |
| Infrastructure | $14,500 | $29,900 | $19,700 |
| **Total COGS** | **$25,500** | **$95,000** | **$235,000** |
| | | | |
| **Gross Profit** | **$65,700** | **$703,000** | **$3,049,800** |
| **Gross Margin** | **72%** | **88%** | **93%** |
| | | | |
| **Operating Expenses** | | | |
| Salaries & Benefits | $185,000 | $420,000 | $780,000 |
| Marketing | $52,000 | $150,000 | $300,000 |
| SaaS Tools | $18,000 | $30,000 | $45,000 |
| Legal & Compliance | $15,000 | $20,000 | $25,000 |
| Other G&A | $4,500 | $10,000 | $18,000 |
| **Total OpEx** | **$274,500** | **$630,000** | **$1,168,000** |
| | | | |
| **EBITDA** | **-$208,800** | **+$73,000** | **+$1,881,800** |
| **EBITDA Margin** | -229% | +9% | +57% |

---

## TAB 5: CASH FLOW

### Cash Flow Summary

| | Year 1 | Year 2 | Year 3 |
|-|--------|--------|--------|
| Opening Cash | $350,000 | $141,200 | $214,200 |
| Operating CF | -$208,800 | +$73,000 | +$1,881,800 |
| Investing CF | -$15,000 | -$25,000 | -$50,000 |
| Financing CF (investment) | +$15,000 | +$25,000 | $0 |
| **Closing Cash** | **$141,200** | **$214,200** | **$2,046,000** |
| **Runway** | **18 месяцев** | ✅ | ✅ |

**Break-even point:** Месяц 22 (Октябрь Year 2)

---

## TAB 6: UNIT ECONOMICS

### Customer Lifetime Value (LTV)

| Тариф | ARPU/мес | Avg Lifetime | LTV | Gross Margin LTV |
|-------|---------|-------------|-----|-----------------|
| Pro | $19 | 6 месяцев (Year 1) | $114 | $82 |
| Pro | $19 | 8 месяцев (Year 2) | $152 | $119 |
| Pro | $19 | 10 месяцев (Year 3) | $190 | $156 |
| Coach | $79 | 12 месяцев | $948 | $758 |

*Avg lifetime = 1 / monthly churn rate. Pro churn 6% → ~6 mес avg lifetime Year 1*

### CAC по каналам (Year 1)

| Канал | Impressions | CTR | Signups | Paid conv | Paid users | Spend | CAC |
|-------|------------|-----|---------|-----------|-----------|-------|-----|
| SEO/Organic | N/A | N/A | 800 | 8% | 64 | $0 | $0 |
| Meta Ads | 250,000 | 0.8% | 2,000 | 8% | 160 | $4,000 | $25 |
| Referral | N/A | N/A | 400 | 8% | 32 | $300 | $9 |
| Influencer | 120,000 | 1.2% | 1,440 | 8% | 115 | $2,000 | $17 |
| **Blended** | | | **4,640** | **8%** | **371** | **$6,300** | **$17** |

### LTV:CAC Ratio

| Year | LTV | CAC | LTV:CAC |
|------|-----|-----|---------|
| 1 | $82 (GM-adjusted) | $35 | **2.3x** |
| 2 | $119 | $28 | **4.3x** |
| 3 | $156 | $22 | **7.1x** |

*Benchmark: LTV:CAC > 3x считается здоровым для SaaS*

---

## TAB 7: SENSITIVITY ANALYSIS

### Сценарий A: Base Case (текущий план)
- Free → Pro conversion: 8%
- Monthly churn: 6%
- CAC: $35
- **Year 3 ARR: $3.3M** ✅

### Сценарий B: Bear Case (конверсия -50%, чёрный лебедь)
- Free → Pro conversion: 4%
- Monthly churn: 9%
- CAC: $70
- **Year 3 ARR: $1.1M** — всё ещё viable, pivot к B2B

### Сценарий C: Bull Case (PMF найден быстро)
- Free → Pro conversion: 14%
- Monthly churn: 3%
- CAC: $20 (strong word-of-mouth)
- **Year 3 ARR: $8.7M** — Series A на более выгодных условиях

### Sensitivity Table (Year 2 ARR)

| ↓ Churn \ Conversion → | 4% | 8% | 14% |
|----------------------|-----|-----|-----|
| **3%** | $520k | $1,050k | $1,840k |
| **6%** | $310k | $798k | $1,400k |
| **9%** | $180k | $450k | $980k |

### Breakeven при изменении assumptions

| Параметр | Base | Если хуже | Breakeven сдвигается |
|----------|------|----------|---------------------|
| Conversion | 8% | 4% | +6 месяцев (мес. 28) |
| Churn | 6% | 9% | +4 месяца (мес. 26) |
| CAC | $35 | $70 | +2 месяца (но нужно больше капитала) |
| ARPU | $19 | $14 | +5 месяцев (мес. 27) |

---

## Ключевые выводы

1. **Бизнес становится прибыльным в месяц 22** при Base Case
2. **$350k seed достаточно** для 18 месяцев runway
3. **LTV:CAC выходит на здоровый уровень к Year 2** (4.3x)
4. **Bear Case всё ещё viable** — pivot к B2B при плохой B2C конверсии
5. **Gross margin 72–93%** — отличный показатель для SaaS

---

*Модель составлена на основе публичных benchmarks: OpenView SaaS Benchmarks 2024, Baremetrics median churn data, Andreessen Horowitz consumer SaaS multiples.*
