// ─────────────────────────────────────────────────────────────
// Translations — en / uk / ru
// Priority order: uk → en → ru (as requested)
// ─────────────────────────────────────────────────────────────

export type Locale = 'uk' | 'en' | 'ru'
export const LOCALES: Locale[] = ['uk', 'en', 'ru']
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  uk: 'Українська (УКР)',
  en: 'English (ENG)',
  ru: 'Русский (РУС)',
}

export const translations = {
  uk: {
    // ── NAV / SIDEBAR ──────────────────────────────────────────
    nav: {
      newSession: 'Нова сесія',
      dashboard: 'Головна',
      insights: 'Інсайти',
      settings: 'Налаштування',
      signOut: 'Вийти',
      freePlan: 'Безкоштовний план',
      proPlan: 'Pro план',
      annualPlan: 'Річний план',
    },

    // ── AUTH ───────────────────────────────────────────────────
    auth: {
      loginTitle: 'З поверненням',
      loginSub: 'Увійдіть, щоб продовжити свою подорож',
      email: 'Email',
      password: 'Пароль',
      signIn: 'Увійти',
      noAccount: 'Немає акаунта?',
      startFree: 'Почати безкоштовно',

      registerTitle: 'Почати безкоштовно',
      registerSub: 'Без кредитної картки · 7-денний триал Pro',
      yourName: "Ваше ім'я (необов'язково)",
      minPassword: 'Мін. 8 символів',
      passwordHint: 'Щонайменше 8 символів',
      createAccount: 'Створити акаунт і почати →',
      alreadyAccount: 'Вже є акаунт?',
      signInLink: 'Увійти',
      terms: 'Умови',
      privacy: 'Конфіденційність',
      bySigningUp: 'Реєструючись, ви погоджуєтесь з нашими',
      and: 'та',

      errorShort: 'Щось пішло не так. Спробуйте ще раз.',
      passwordTooShort: 'Пароль має містити щонайменше 8 символів',
    },

    // ── DASHBOARD ─────────────────────────────────────────────
    dashboard: {
      morning: 'Доброго ранку',
      afternoon: 'Доброго дня',
      evening: 'Доброго вечора',
      activeOn: 'Ви на {day}-му дні проєкту «{name}».',
      letsFind: 'Давайте дізнаємось, що ви будуєте.',
      startFirst: 'Почніть першу Discovery-сесію',
      sessionDesc: '25-хвилинна розмова з ШІ, яка розкриє, що ви хочете побудувати — і перетворить це в 90-денний план.',
      startFreeSession: 'Почати безкоштовну сесію →',
      activeProject: 'Активний проєкт',
      progress: 'Прогрес',
      active: 'Активний',
      dayStreak: 'дні поспіль',
      newSession: 'Нова сесія',
      exploreOrUnstuck: 'Досліджуйте або розблокуйтесь',
      myProject: 'Мій проєкт',
      viewTasks: 'Завдання та дорожня карта',
      insights: 'Інсайти',
      patternsProgress: 'Паттерни та прогрес',
    },

    // ── SETTINGS ──────────────────────────────────────────────
    settings: {
      title: 'Налаштування',
      successUpgrade: "🎉 Ви перейшли на Pro план. Ласкаво просимо до повного досвіду!",
      canceledCheckout: 'Оформлення скасовано. Ви можете повернутися, коли будете готові.',
      subscription: 'Підписка',
      currentPlan: 'Поточний план',
      manageSubscription: 'Керувати підпискою',
      upgradePro: 'Перейти на Pro',
      upgradeAnnual: 'Перейти на річний план',
      proDesc: 'Необмежені сесії, 90-денний план, щоденний ШІ-компаньйон',
      annualDesc: 'Все з Pro + 2 місяці безкоштовно',
      language: 'Мова',
      languageDesc: 'Оберіть мову інтерфейсу',
      account: 'Акаунт',
      name: "Ім'я",
      emailLabel: 'Email',
      signOut: 'Вийти з акаунта',
    },

    // ── WAITLIST ───────────────────────────────────────────────
    waitlist: {
      heading: 'Приєднайтесь до черги',
      sub: 'Дізнайтеся першими про запуск. Без спаму.',
      namePlaceholder: "Ваше ім'я (необов'язково)",
      emailPlaceholder: 'your@email.com',
      cta: 'Отримати ранній доступ',
      loading: 'Реєстрація…',
      success: 'Ви в списку! Ми напишемо вам.',
      alreadyOn: 'Ви вже в списку.',
      error: 'Щось пішло не так. Спробуйте ще раз.',
    },

    // ── COMMON ────────────────────────────────────────────────
    common: {
      loading: 'Завантаження…',
      save: 'Зберегти',
      cancel: 'Скасувати',
      confirm: 'Підтвердити',
      free: 'Безкоштовно',
      pro: 'Pro',
      annual: 'Річний',
    },
  },

  en: {
    nav: {
      newSession: 'New Session',
      dashboard: 'Dashboard',
      insights: 'Insights',
      settings: 'Settings',
      signOut: 'Sign out',
      freePlan: 'Free plan',
      proPlan: 'Pro plan',
      annualPlan: 'Annual plan',
    },

    auth: {
      loginTitle: 'Welcome back',
      loginSub: 'Sign in to continue your journey',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      startFree: 'Start free',

      registerTitle: 'Start for free',
      registerSub: 'No credit card required · 7-day trial on Pro',
      yourName: 'Your name (optional)',
      minPassword: 'Min. 8 characters',
      passwordHint: 'At least 8 characters',
      createAccount: 'Create Account & Start Discovery →',
      alreadyAccount: 'Already have an account?',
      signInLink: 'Sign in',
      terms: 'Terms',
      privacy: 'Privacy Policy',
      bySigningUp: 'By signing up you agree to our',
      and: 'and',

      errorShort: 'Something went wrong. Please try again.',
      passwordTooShort: 'Password must be at least 8 characters',
    },

    dashboard: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      activeOn: "You're on Day {day} of {name}.",
      letsFind: "Let's find out what you're building.",
      startFirst: 'Start your first Discovery Session',
      sessionDesc: 'A 25-minute AI conversation that uncovers what you truly want to build — and turns it into a 90-day plan.',
      startFreeSession: 'Start Free Session →',
      activeProject: 'Active Project',
      progress: 'Progress',
      active: 'Active',
      dayStreak: 'day streak',
      newSession: 'New Session',
      exploreOrUnstuck: 'Explore or get unstuck',
      myProject: 'My Project',
      viewTasks: 'View tasks & roadmap',
      insights: 'Insights',
      patternsProgress: 'Patterns & progress',
    },

    settings: {
      title: 'Settings',
      successUpgrade: "🎉 You're now on the Pro plan. Welcome to the full experience!",
      canceledCheckout: 'Checkout canceled. You can come back when you\'re ready.',
      subscription: 'Subscription',
      currentPlan: 'Current plan',
      manageSubscription: 'Manage subscription',
      upgradePro: 'Upgrade to Pro',
      upgradeAnnual: 'Upgrade to Annual',
      proDesc: 'Unlimited sessions, 90-day roadmap, daily AI companion',
      annualDesc: 'Everything in Pro + 2 months free',
      language: 'Language',
      languageDesc: 'Choose your interface language',
      account: 'Account',
      name: 'Name',
      emailLabel: 'Email',
      signOut: 'Sign out',
    },

    waitlist: {
      heading: 'Join the waitlist',
      sub: 'Be first to know when we launch. No spam, ever.',
      namePlaceholder: 'Your name (optional)',
      emailPlaceholder: 'your@email.com',
      cta: 'Get early access',
      loading: 'Joining…',
      success: "You're on the list! We'll be in touch.",
      alreadyOn: "You're already on the list.",
      error: 'Something went wrong. Please try again.',
    },

    common: {
      loading: 'Loading…',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      free: 'Free',
      pro: 'Pro',
      annual: 'Annual',
    },
  },

  ru: {
    nav: {
      newSession: 'Новая сессия',
      dashboard: 'Главная',
      insights: 'Инсайты',
      settings: 'Настройки',
      signOut: 'Выйти',
      freePlan: 'Бесплатный план',
      proPlan: 'Pro план',
      annualPlan: 'Годовой план',
    },

    auth: {
      loginTitle: 'С возвращением',
      loginSub: 'Войдите, чтобы продолжить своё путешествие',
      email: 'Email',
      password: 'Пароль',
      signIn: 'Войти',
      noAccount: 'Нет аккаунта?',
      startFree: 'Начать бесплатно',

      registerTitle: 'Начать бесплатно',
      registerSub: 'Без кредитной карты · 7-дневный триал Pro',
      yourName: 'Ваше имя (необязательно)',
      minPassword: 'Мин. 8 символов',
      passwordHint: 'Не менее 8 символов',
      createAccount: 'Создать аккаунт и начать →',
      alreadyAccount: 'Уже есть аккаунт?',
      signInLink: 'Войти',
      terms: 'Условия',
      privacy: 'Политика конфиденциальности',
      bySigningUp: 'Регистрируясь, вы соглашаетесь с нашими',
      and: 'и',

      errorShort: 'Что-то пошло не так. Попробуйте ещё раз.',
      passwordTooShort: 'Пароль должен содержать не менее 8 символов',
    },

    dashboard: {
      morning: 'Доброе утро',
      afternoon: 'Добрый день',
      evening: 'Добрый вечер',
      activeOn: 'Вы на {day}-м дне проекта «{name}».',
      letsFind: 'Давайте узнаем, что вы строите.',
      startFirst: 'Начните первую Discovery-сессию',
      sessionDesc: '25-минутный разговор с ИИ, который раскроет, что вы хотите построить — и превратит это в 90-дневный план.',
      startFreeSession: 'Начать бесплатную сессию →',
      activeProject: 'Активный проект',
      progress: 'Прогресс',
      active: 'Активный',
      dayStreak: 'дней подряд',
      newSession: 'Новая сессия',
      exploreOrUnstuck: 'Исследуйте или разблокируйтесь',
      myProject: 'Мой проект',
      viewTasks: 'Задачи и дорожная карта',
      insights: 'Инсайты',
      patternsProgress: 'Паттерны и прогресс',
    },

    settings: {
      title: 'Настройки',
      successUpgrade: '🎉 Вы перешли на Pro план. Добро пожаловать в полный опыт!',
      canceledCheckout: 'Оформление отменено. Можете вернуться, когда будете готовы.',
      subscription: 'Подписка',
      currentPlan: 'Текущий план',
      manageSubscription: 'Управление подпиской',
      upgradePro: 'Перейти на Pro',
      upgradeAnnual: 'Перейти на годовой план',
      proDesc: 'Неограниченные сессии, 90-дневный план, ежедневный ИИ-компаньон',
      annualDesc: 'Всё из Pro + 2 месяца бесплатно',
      language: 'Язык',
      languageDesc: 'Выберите язык интерфейса',
      account: 'Аккаунт',
      name: 'Имя',
      emailLabel: 'Email',
      signOut: 'Выйти из аккаунта',
    },

    waitlist: {
      heading: 'Присоединиться к очереди',
      sub: 'Узнайте первыми о запуске. Без спама.',
      namePlaceholder: 'Ваше имя (необязательно)',
      emailPlaceholder: 'your@email.com',
      cta: 'Получить ранний доступ',
      loading: 'Регистрация…',
      success: 'Вы в списке! Мы напишем вам.',
      alreadyOn: 'Вы уже в списке.',
      error: 'Что-то пошло не так. Попробуйте ещё раз.',
    },

    common: {
      loading: 'Загрузка…',
      save: 'Сохранить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      free: 'Бесплатно',
      pro: 'Pro',
      annual: 'Годовой',
    },
  },
} as const

export type Translations = typeof translations.en
