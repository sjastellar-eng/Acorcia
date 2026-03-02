# GDPR Compliance Checklist — Source Constructor

> Статус: Работа в процессе | Обновлено: Март 2026

---

## Категории пользователей

- [x] Идентифицированы EU/EEA пользователи как отдельная категория
- [x] Privacy Policy написана с учётом прав GDPR
- [ ] DPA (Data Processing Agreement) подписан с ключевыми processors
- [ ] Назначен Data Protection Officer (если применимо)

---

## 1. Lawful Basis for Processing

| Обработка данных | Правовое основание | Статус |
|-----------------|-------------------|--------|
| Account registration | Контракт (ст. 6(1)(b)) | ✅ Определено |
| Discovery Session processing | Контракт | ✅ Определено |
| AI API processing | Контракт + Legitimate interests | ✅ Определено |
| Marketing emails | Согласие (ст. 6(1)(a)) | ✅ Opt-in required |
| Analytics (PostHog) | Legitimate interests | ⚠️ Cookie banner required |
| Payment processing | Контракт | ✅ Определено |

---

## 2. Privacy by Design

- [x] Сбор только необходимых данных (data minimization)
- [x] Данные AI prompt anonymized (no full name/email in AI calls)
- [x] Encryption at rest и in transit
- [x] Role-based access control (RLS в Supabase)
- [ ] Privacy impact assessment (DPIA) проведена
- [x] Retention periods определены для всех типов данных

---

## 3. Data Subject Rights — Техническая реализация

| Право | Реализация | Статус |
|-------|-----------|--------|
| Право на доступ | Export data endpoint + email request | ⚠️ В разработке |
| Право на исправление | Profile settings (name, email) | ✅ Готово |
| Право на удаление | Delete account → 30-day purge | ✅ Реализовано |
| Право на переносимость | JSON export (sessions, projects) | ⚠️ В разработке |
| Право на ограничение | Manual process + API | ❌ Не реализовано |
| Право на возражение | Unsubscribe + analytics opt-out | ✅ Email; ⚠️ Analytics |

---

## 4. Data Processors (Subprocessors)

| Processor | Данные | DPA | Регион обработки |
|-----------|--------|-----|-----------------|
| Supabase | All user data | ✅ В наличии | EU (Germany) |
| Anthropic (Claude) | Session content | ⚠️ Нужно проверить | US |
| Stripe | Payment data | ✅ В наличии | US + EU |
| PostHog | Analytics events | ✅ В наличии | EU |
| Resend | Email addresses | ✅ В наличии | US |
| Vercel | Traffic metadata | ✅ В наличии | EU + US |

**Action items:**
- [ ] Проверить DPA с Anthropic для EU users
- [ ] Рассмотреть EU-hosted Anthropic API (если доступно)
- [ ] Обновить Privacy Policy со списком subprocessors

---

## 5. Cookie Compliance

- [x] Cookie policy задокументирована
- [x] Только essential cookies без согласия
- [ ] Cookie consent banner реализован
- [ ] Cookies audit проведён (полный список)
- [ ] Документировано что каждый cookie делает

**Cookie banner требования:**
- Появляется при первом посещении для EU пользователей
- Разделение: essential / analytics / marketing
- Возможность отклонить всё кроме essential
- Хранение согласия (timestamp + выбор)

---

## 6. Privacy Notices

- [x] Privacy Policy написана на понятном языке
- [ ] Privacy Policy переведена на немецкий, французский (если нужно)
- [x] Ссылка на Privacy Policy в footer всех страниц
- [x] Privacy Policy указана при регистрации (checkbox)
- [ ] Cookie notice реализован
- [ ] Unsubscribe механизм в каждом маркетинговом письме

---

## 7. Data Breach Response Plan

### Обнаружение
- [ ] Мониторинг настроен (Sentry + database alerts)
- [ ] Процедура оценки severity определена
- [ ] Ответственный за инциденты назначен

### Реагирование (72 часов)
- [ ] Template уведомления для пользователей готов
- [ ] Template уведомления для DPA готов
- [ ] Список: кто получает уведомление в каком случае

### Документация
- [ ] Incident log создан (secure, private)
- [ ] Post-incident review процедура определена

---

## 8. Special Categories of Data

SOC обрабатывает потенциально чувствительные данные (психологические профили, желания, страхи).

**Это не является "специальной категорией" по ст. 9 GDPR** (которая охватывает здоровье, расовое происхождение, политические взгляды, религию, биометрию и т.д.), если только пользователи не раскрывают такую информацию в своих ответах.

**Action items:**
- [ ] Проверить может ли Discovery Session отвечать данными о здоровье (и как обрабатывать)
- [ ] Рассмотреть предупреждение пользователям не делиться медицинской информацией
- [ ] Если собираем данные о здоровье — нужен explicit consent (ст. 9(2)(a))

---

## 9. International Transfers

- [ ] Standard Contractual Clauses (SCCs) проверены и подписаны с US processors
- [ ] Transfer impact assessment (TIA) для Anthropic API
- [ ] Privacy Policy описывает международные трансферы

---

## 10. Records of Processing Activities (ROPA)

Обязателен для компаний с > 250 сотрудников, но рекомендован для всех. Начать вести сейчас.

**ROPA должен включать:**
- [ ] Каждый тип обработки данных
- [ ] Цель обработки
- [ ] Правовое основание
- [ ] Категории данных
- [ ] Категории субъектов
- [ ] Processors задействованные
- [ ] Сроки хранения

---

## 11. Приоритетные Action Items (по срочности)

### Critical (до launch)
1. [ ] Cookie consent banner
2. [ ] DPA с Anthropic
3. [ ] Export data endpoint
4. [ ] EU-specific GDPR rights contact form

### Important (первые 3 месяца после launch)
5. [ ] DPIA (Data Protection Impact Assessment)
6. [ ] ROPA ведение
7. [ ] Юридический review Privacy Policy & ToS
8. [ ] Analytics opt-out implementation

### Nice-to-have (Year 1)
9. [ ] DPO назначение (если needed)
10. [ ] Переводы Privacy Policy
11. [ ] Automated data deletion workflows

---

*Этот чеклист — живой документ. Обновляй при каждом изменении продукта или процессов.*
*Disclaimer: не является юридической консультацией. Проконсультируйся с GDPR-специалистом.*
