import type { RangeKey, SupportedLanguage } from '../types/i18n';

export const supportedLanguages: SupportedLanguage[] = ['en', 'ar', 'si', 'fr'];

export const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  ar: 'العربية',
  si: 'සිංහල',
  fr: 'Français',
};

type AppCopy = {
  readyActivated: string;
  prepareProfile: string;
  updateProfile: string;
  startConnecting: string;
  connectSuccess: string;
  idlePrompt: string;
  roundStarted: (roundNumber: number) => string;
  roundFinished: (roundNumber: number, multiplier: string) => string;
  telegramContinue: string;
  telegramActivating: string;
};

type OnboardingCopy = {
  title: string;
  heroEyebrow: string;
  heroCopy: string;
  insideTitle: string;
  insideItems: string[];
  startTitle: string;
  startItems: string[];
  continue: string;
};

type VerificationCopy = {
  eyebrow: string;
  title: string;
  stepLabel: string;
  step1Text: string;
  promoCodeLabel: string;
  promoHint: string;
  step2Title: string;
  step2Example: string;
  step2Hint: string;
  step3Text: string;
  inputLabel: string;
  inputPlaceholder: string;
  note: string;
  submit: string;
  connectingEyebrow: string;
  connectingTitle: string;
  connectingBody: (pendingId: string) => string;
  connectingSteps: string[];
};

type GameCopy = {
  topline: string;
  start: string;
  running: string;
  reload: string;
  waitingStatus: string;
  flyingStatus: string;
  explodedStatus: string;
  exactPoint: string;
  flightPoint: string;
  hidden: string;
};

type HistoryCopy = {
  eyebrow: string;
  title: string;
  records: (count: number) => string;
  empty: string;
  round: (roundNumber: number) => string;
  completed: string;
};

type TickerCopy = {
  eyebrow: string;
  title: string;
  caption: string;
  next: string;
  emptyLabel: string;
  emptyValue: string;
};

type InsightsCopy = {
  eyebrow: string;
  title: string;
  caption: string;
  completedRounds: string;
  averageMultiplier: string;
  expectedLength: string;
  focusEyebrow: string;
  cues: Record<
    Exclude<RangeKey, 'custom'>,
    {
      title: string;
      description: string;
    }
  >;
};

type MultiplierCopy = {
  current: string;
  targetKnown: string;
  stages: {
    round_idle: string;
    round_running: string;
    round_finished: string;
  };
};

export type TranslationBundle = {
  locale: string;
  direction: 'ltr' | 'rtl';
  languages: Record<SupportedLanguage, string>;
  app: AppCopy;
  onboarding: OnboardingCopy;
  verification: VerificationCopy;
  game: GameCopy;
  history: HistoryCopy;
  ticker: TickerCopy;
  insights: InsightsCopy;
  multiplier: MultiplierCopy;
  ranges: Record<RangeKey, string>;
  pilot: string;
};

const translations: Record<SupportedLanguage, TranslationBundle> = {
  en: {
    locale: 'en-US',
    direction: 'ltr',
    languages: languageLabels,
    app: {
      readyActivated: 'Training mode is already active. You can launch the next round.',
      prepareProfile: 'Prepare your profile to launch training rounds.',
      updateProfile: 'You can update your training ID and activate the profile again.',
      startConnecting: 'Starting local activation for training mode...',
      connectSuccess: 'ID accepted. You can start training.',
      idlePrompt: 'Press start to generate a new round.',
      roundStarted: (roundNumber) => `Round #${roundNumber} started.`,
      roundFinished: (roundNumber, multiplier) =>
        `Round #${roundNumber} finished at ${multiplier}.`,
      telegramContinue: 'Continue',
      telegramActivating: 'Activating...',
    },
    onboarding: {
      title: 'Aviator Signal',
      heroEyebrow: 'دخول الإشارة',
      heroCopy:
        'Inside the app you receive a ready signal and see the key point of the round in advance.',
      insideTitle: 'What is inside',
      insideItems: [
        'We connect to the provider and receive an internal signal for the Aviator game.',
        'Then we pass it to you inside the app so you can use it in your own game.',
        'The event outcome accuracy reaches 99%.',
      ],
      startTitle: 'How to begin',
      startItems: [
        'First activate your training profile using your ID.',
        'After activation, launch rounds in the app and follow the multiplier on the site in parallel.',
        'The app will show in advance where the plane will crash so you can follow the round movement.',
      ],
      continue: 'Continue',
    },
    verification: {
      eyebrow: 'Activation',
      title: 'Get access',
      stepLabel: 'Step',
      step1Text: 'To receive access, register through the link below:',
      promoCodeLabel: 'Promo code',
      promoHint: 'Enter it during registration and receive access plus up to 150 Free Spins.',
      step2Title: 'Your ID on the LuckyPari website',
      step2Example: 'Example: 123456789',
      step2Hint: 'You can find it on the website inside your personal profile.',
      step3Text: 'Enter your ID below to activate access inside the app.',
      inputLabel: 'ID on the LuckyPari website',
      inputPlaceholder: 'For example, 123456789',
      note: 'After sending the ID, verification will start. It usually takes from 5 to 10 seconds.',
      submit: 'Activate access',
      connectingEyebrow: 'Access check',
      connectingTitle: 'Connecting verification mode',
      connectingBody: (pendingId) =>
        `ID ${pendingId} accepted. Verification and access activation for the next rounds is now in progress.`,
      connectingSteps: [
        'Registered through the link',
        'Entered the promo code',
        'Made a deposit',
      ],
    },
    game: {
      topline:
        'Press start at the same time as the bet on the site and get the exact moment when the plane ends its flight.',
      start: 'START',
      running: 'FLIGHT...',
      reload: 'RELOADING',
      waitingStatus: 'Waiting for generation',
      flyingStatus: 'Plane in flight',
      explodedStatus: 'Plane exploded',
      exactPoint: 'Exact point',
      flightPoint: 'Flight point',
      hidden: 'hidden',
    },
    history: {
      eyebrow: 'Round journal',
      title: 'Latest results',
      records: (count) => `${count} records`,
      empty: 'History will appear after the first training round is completed.',
      round: (roundNumber) => `Round #${roundNumber}`,
      completed: 'Completed',
    },
    ticker: {
      eyebrow: 'Results feed',
      title: 'Current session rhythm',
      caption: 'Recent and upcoming round',
      next: 'Next',
      emptyLabel: 'Empty for now',
      emptyValue: 'Waiting for the first finish',
    },
    insights: {
      eyebrow: 'Training analytics',
      title: 'Current session snapshot',
      caption: 'No real bets',
      completedRounds: 'Completed rounds',
      averageMultiplier: 'Average multiplier',
      expectedLength: 'Expected length',
      focusEyebrow: 'Round focus',
      cues: {
        base: {
          title: 'Short sprint',
          description:
            'The next round will end quickly. A good moment to get used to the opening phase and the pace of growth.',
        },
        boosted: {
          title: 'Medium distance',
          description:
            'The round lasts longer than the base range. It helps you feel the acceleration and the visual rhythm better.',
        },
        advanced: {
          title: 'Long flight',
          description:
            'A rarer higher range. Useful for studying the multiplier on a longer trajectory.',
        },
        rare: {
          title: 'Rare high peak',
          description:
            'This is a rare scenario with a long acceleration segment. It is useful to remember it as a benchmark for a long round.',
        },
      },
    },
    multiplier: {
      current: 'Current multiplier',
      targetKnown: 'Target is known in advance',
      stages: {
        round_idle: 'Round ready',
        round_running: 'Multiplier rising',
        round_finished: 'Target reached',
      },
    },
    ranges: {
      base: 'Base range',
      boosted: 'Boosted range',
      advanced: 'Advanced range',
      rare: 'Rare high range',
      custom: 'Custom range',
    },
    pilot: 'Pilot',
  },
  ar: {
    locale: 'ar',
    direction: 'rtl',
    languages: languageLabels,
    app: {
      readyActivated: 'تم تفعيل وضع التدريب بالفعل. يمكنك بدء الجولة التالية.',
      prepareProfile: 'جهز ملفك لبدء جولات التدريب.',
      updateProfile: 'يمكنك تحديث معرف التدريب وتفعيل الملف مرة أخرى.',
      startConnecting: 'جارٍ بدء التفعيل المحلي لوضع التدريب...',
      connectSuccess: 'تم قبول المعرّف. يمكنك بدء التدريب.',
      idlePrompt: 'اضغط ابدأ لإنشاء جولة جديدة.',
      roundStarted: (roundNumber) => `بدأت الجولة #${roundNumber}.`,
      roundFinished: (roundNumber, multiplier) =>
        `انتهت الجولة #${roundNumber} عند ${multiplier}.`,
      telegramContinue: 'متابعة',
      telegramActivating: 'جارٍ التفعيل...',
    },
    onboarding: {
      title: 'Aviator Signal',
      heroEyebrow: 'دخول الإشارة',
      heroCopy:
        'داخل التطبيق تحصل على الإشارة الجاهزة وترى النقطة الأساسية للجولة مسبقًا.',
      insideTitle: 'ما الذي بداخل التطبيق',
      insideItems: [
        'نحن نتصل بالمزوّد ونحصل على إشارة داخلية للعبة Aviator.',
        'ثم نرسلها لك داخل التطبيق حتى تتمكن من استخدامها في لعبتك.',
        'تصل دقة تحديد نتيجة الحدث إلى 99%.',
      ],
      startTitle: 'كيف تبدأ',
      startItems: [
        'فعّل أولاً ملف التدريب باستخدام معرفك.',
        'بعد التفعيل شغّل الجولات داخل التطبيق وراقب المضاعف على الموقع في الوقت نفسه.',
        'سيعرض التطبيق مسبقًا أين ستنفجر الطائرة حتى تتمكن من متابعة حركة الجولة.',
      ],
      continue: 'متابعة',
    },
    verification: {
      eyebrow: 'التفعيل',
      title: 'الحصول على الوصول',
      stepLabel: 'الخطوة',
      step1Text: 'للحصول على الوصول، يجب التسجيل عبر الرابط التالي:',
      promoCodeLabel: 'رمز ترويجي',
      promoHint: 'أدخله أثناء التسجيل لتحصل على الوصول وحتى 150 دورة مجانية.',
      step2Title: 'معرّفك على موقع LuckyPari',
      step2Example: 'مثال: 123456789',
      step2Hint: 'ستجده على الموقع داخل ملفك الشخصي.',
      step3Text: 'أدخل معرّفك أدناه لتفعيل الوصول داخل التطبيق.',
      inputLabel: 'المعرّف على موقع LuckyPari',
      inputPlaceholder: 'مثال: 123456789',
      note: 'بعد إرسال المعرّف ستبدأ عملية التحقق. تستغرق عادة من 5 إلى 10 ثوانٍ.',
      submit: 'تفعيل الوصول',
      connectingEyebrow: 'فحص الوصول',
      connectingTitle: 'جارٍ توصيل وضع التحقق',
      connectingBody: (pendingId) =>
        `تم قبول المعرّف ${pendingId}. جارٍ الآن التحقق وتفعيل الوصول للجولات التالية.`,
      connectingSteps: [
        'سجّل عبر الرابط',
        'أدخل الرمز الترويجي',
        'أجرى إيداعًا',
      ],
    },
    game: {
      topline:
        'اضغط ابدأ في نفس لحظة الرهان على الموقع واحصل على اللحظة الدقيقة التي تنتهي فيها رحلة الطائرة.',
      start: 'ابدأ',
      running: 'جارية...',
      reload: 'إعادة تحميل',
      waitingStatus: 'بانتظار التوليد',
      flyingStatus: 'الطائرة في الجو',
      explodedStatus: 'انفجرت الطائرة',
      exactPoint: 'النقطة الدقيقة',
      flightPoint: 'نقطة الطيران',
      hidden: 'مخفية',
    },
    history: {
      eyebrow: 'سجل الجولات',
      title: 'آخر النتائج',
      records: (count) => `${count} سجل`,
      empty: 'سيظهر السجل بعد اكتمال أول جولة تدريبية.',
      round: (roundNumber) => `الجولة #${roundNumber}`,
      completed: 'مكتملة',
    },
    ticker: {
      eyebrow: 'شريط النتائج',
      title: 'إيقاع الجلسة الحالي',
      caption: 'آخر جولة والجولة القادمة',
      next: 'التالي',
      emptyLabel: 'لا شيء بعد',
      emptyValue: 'ننتظر أول نهاية',
    },
    insights: {
      eyebrow: 'تحليلات التدريب',
      title: 'ملخص الجلسة الحالية',
      caption: 'بدون رهانات حقيقية',
      completedRounds: 'الجولات المكتملة',
      averageMultiplier: 'متوسط المضاعف',
      expectedLength: 'المدة المتوقعة',
      focusEyebrow: 'تركيز الجولة',
      cues: {
        base: {
          title: 'اندفاعة قصيرة',
          description:
            'ستنتهي الجولة التالية بسرعة. هذا وقت جيد للاعتياد على بداية الجولة وسرعة النمو.',
        },
        boosted: {
          title: 'مسافة متوسطة',
          description:
            'تستمر الجولة أكثر من النطاق الأساسي. يساعدك ذلك على الإحساس بالتسارع والإيقاع البصري.',
        },
        advanced: {
          title: 'رحلة طويلة',
          description:
            'هذا نطاق أعلى وأكثر ندرة. مفيد لدراسة سلوك المضاعف على مسار أطول.',
        },
        rare: {
          title: 'قمة عالية نادرة',
          description:
            'هذا سيناريو نادر مع مرحلة تسارع طويلة. من المفيد تذكره كنموذج لجولة طويلة.',
        },
      },
    },
    multiplier: {
      current: 'المضاعف الحالي',
      targetKnown: 'الهدف معروف مسبقًا',
      stages: {
        round_idle: 'الجولة جاهزة',
        round_running: 'المضاعف يرتفع',
        round_finished: 'تم الوصول إلى الهدف',
      },
    },
    ranges: {
      base: 'النطاق الأساسي',
      boosted: 'النطاق المعزّز',
      advanced: 'النطاق المتقدم',
      rare: 'نطاق مرتفع نادر',
      custom: 'نطاق مخصص',
    },
    pilot: 'الطيار',
  },
  si: {
    locale: 'si-LK',
    direction: 'ltr',
    languages: languageLabels,
    app: {
      readyActivated: 'පුහුණු මාදිලිය දැනටමත් සක්‍රීයයි. ඊළඟ වටය ආරම්භ කළ හැක.',
      prepareProfile: 'පුහුණු වට ආරම්භ කිරීමට ඔබගේ ප්‍රොෆයිලය සූදානම් කරන්න.',
      updateProfile: 'ඔබගේ පුහුණු ID යාවත්කාලීන කර නැවත ප්‍රොෆයිලය සක්‍රීය කළ හැක.',
      startConnecting: 'පුහුණු මාදිලිය සඳහා දේශීය සක්‍රීයකරණය ආරම්භ කරමින්...',
      connectSuccess: 'ID පිළිගන්නා ලදී. දැන් පුහුණුව ආරම්භ කළ හැක.',
      idlePrompt: 'නව වටයක් ජනනය කිරීමට Start ඔබන්න.',
      roundStarted: (roundNumber) => `වටය #${roundNumber} ආරම්භ විය.`,
      roundFinished: (roundNumber, multiplier) =>
        `වටය #${roundNumber} ${multiplier} හි අවසන් විය.`,
      telegramContinue: 'ඉදිරියට',
      telegramActivating: 'සක්‍රීය කරමින්...',
    },
    onboarding: {
      title: 'Aviator Signal',
      heroEyebrow: 'සංඥා ප්‍රවේශය',
      heroCopy:
        'යෙදුම තුළ ඔබට සූදානම් signal එක ලැබෙන අතර වටයේ ප්‍රධාන ස්ථානය කලින්ම පෙනේ.',
      insideTitle: 'ඇතුළත ඇති දේ',
      insideItems: [
        'අපි provider වෙත සම්බන්ධ වී Aviator ක්‍රීඩාව සඳහා අභ්‍යන්තර signal එක ලබා ගනිමු.',
        'ඉන්පසු එය ඔබට යෙදුම තුළ ලබා දී ඔබගේ ක්‍රීඩාවේ භාවිතා කිරීමට ඉඩ දෙමු.',
        'සිදුවීම් ප්‍රතිඵල හඳුනාගැනීමේ නිරවද්‍යතාවය 99% දක්වා ළඟා වේ.',
      ],
      startTitle: 'කෙසේ ආරම්භ කළ යුතුද',
      startItems: [
        'පළමුව ඔබගේ ID භාවිතයෙන් පුහුණු profile එක සක්‍රීය කරන්න.',
        'සක්‍රීයකරණයෙන් පසු යෙදුම තුළ වට ආරම්භ කර, එකවර site එකේ multiplier එක නිරීක්ෂණය කරන්න.',
        'ගුවන් යානය කොතැනකදී කඩා වැටේද යන්න යෙදුම කලින්ම පෙන්වයි.',
      ],
      continue: 'ඉදිරියට',
    },
    verification: {
      eyebrow: 'සක්‍රීයකරණය',
      title: 'ප්‍රවේශය ලබා ගැනීම',
      stepLabel: 'පියවර',
      step1Text: 'ප්‍රවේශය ලබා ගැනීමට, පහත link එකෙන් අනිවාර්යයෙන් ලියාපදිංචි වන්න:',
      promoCodeLabel: 'Promo code',
      promoHint: 'ලියාපදිංචියේදී එය ඇතුළත් කර ප්‍රවේශය සහ 150 Free Spins දක්වා ලබා ගන්න.',
      step2Title: 'LuckyPari site එකේ ඔබගේ ID',
      step2Example: 'උදාහරණය: 123456789',
      step2Hint: 'එය site එකේ ඔබගේ personal profile තුළ සොයා ගත හැක.',
      step3Text: 'යෙදුම තුළ ප්‍රවේශය සක්‍රීය කිරීමට ඔබගේ ID පහතින් ඇතුළත් කරන්න.',
      inputLabel: 'LuckyPari site එකේ ID',
      inputPlaceholder: 'උදාහරණයක් ලෙස, 123456789',
      note: 'ID යැවූ පසු පරීක්ෂාව ආරම්භ වේ. සාමාන්‍යයෙන් තත්පර 5 සිට 10 දක්වා ගනී.',
      submit: 'ප්‍රවේශය සක්‍රීය කරන්න',
      connectingEyebrow: 'ප්‍රවේශ පරීක්ෂාව',
      connectingTitle: 'Verification mode සම්බන්ධ කරමින්',
      connectingBody: (pendingId) =>
        `ID ${pendingId} පිළිගන්නා ලදී. ඊළඟ වට සඳහා පරීක්ෂාව සහ ප්‍රවේශ සක්‍රීයකරණය දැන් සිදු වෙමින් පවතී.`,
      connectingSteps: [
        'Link එකෙන් ලියාපදිංචි විය',
        'Promo code එක ඇතුළත් කළා',
        'Deposit එකක් කළා',
      ],
    },
    game: {
      topline:
        'site එකේ bet එක සමඟ එකවර Start ඔබා, ගුවන් යානයේ ගමන අවසන් වන නිවැරදි මොහොත ලබා ගන්න.',
      start: 'ආරම්භය',
      running: 'පියාසරය...',
      reload: 'නැවත පූරණය',
      waitingStatus: 'ජනනය බලා සිටී',
      flyingStatus: 'ගුවන් යානය පියාසර කරයි',
      explodedStatus: 'ගුවන් යානය පුපුරා ගියා',
      exactPoint: 'නිවැරදි ස්ථානය',
      flightPoint: 'පියාසැරි ස්ථානය',
      hidden: 'සඟවා ඇත',
    },
    history: {
      eyebrow: 'වට සටහන්',
      title: 'අවසන් ප්‍රතිඵල',
      records: (count) => `සටහන් ${count}`,
      empty: 'පළමු පුහුණු වටය අවසන් වූ පසු ඉතිහාසය දිස්වනු ඇත.',
      round: (roundNumber) => `වටය #${roundNumber}`,
      completed: 'අවසන්',
    },
    ticker: {
      eyebrow: 'ප්‍රතිඵල පටිපාටිය',
      title: 'වත්මන් session රිද්මය',
      caption: 'අවසන් සහ ඊළඟ වටය',
      next: 'ඊළඟ',
      emptyLabel: 'තවම හිස්',
      emptyValue: 'පළමු finish එක බලා සිටී',
    },
    insights: {
      eyebrow: 'පුහුණු විශ්ලේෂණය',
      title: 'වත්මන් session සාරාංශය',
      caption: 'සැබෑ betting නොමැත',
      completedRounds: 'අවසන් වට',
      averageMultiplier: 'සාමාන්‍ය multiplier',
      expectedLength: 'අපේක්ෂිත දිග',
      focusEyebrow: 'වටයේ අවධානය',
      cues: {
        base: {
          title: 'කෙටි sprint එක',
          description:
            'ඊළඟ වටය ඉක්මනින් අවසන් වේ. ආරම්භක අදියර සහ වර්ධන වේගයට හුරු වීමට හොඳ අවස්ථාවකි.',
        },
        boosted: {
          title: 'මධ්‍ය දුර',
          description:
            'මෙම වටය මූලික පරාසයට වඩා දිගු වේ. මෙය ත්වරණය සහ දෘශ්‍ය රිද්මය හොඳින් දැනෙන්න උපකාරී වේ.',
        },
        advanced: {
          title: 'දිගු පියාසැරිය',
          description:
            'වඩා දුර්ලභ ඉහළ පරාසයකි. දිගු පථයක multiplier හැසිරීම අධ්‍යයනය කිරීමට ප්‍රයෝජනවත්ය.',
        },
        rare: {
          title: 'දුර්ලභ ඉහළ උච්චය',
          description:
            'මෙය දිගු acceleration කොටසක් සහිත දුර්ලභ තත්ත්වයකි. දිගු වටයක මැනුම් දණ්ඩක් ලෙස මතක තබා ගැනීමට හොඳයි.',
        },
      },
    },
    multiplier: {
      current: 'වත්මන් multiplier',
      targetKnown: 'ඉලක්කය කලින්ම දන්නා ලදි',
      stages: {
        round_idle: 'වටය සූදානම්',
        round_running: 'Multiplier ඉහළ යයි',
        round_finished: 'ඉලක්කය ළඟා විය',
      },
    },
    ranges: {
      base: 'මූලික පරාසය',
      boosted: 'වේගවත් පරාසය',
      advanced: 'උසස් පරාසය',
      rare: 'දුර්ලභ ඉහළ පරාසය',
      custom: 'අභිරුචි පරාසය',
    },
    pilot: 'නියමුවා',
  },
  fr: {
    locale: 'fr-FR',
    direction: 'ltr',
    languages: languageLabels,
    app: {
      readyActivated: 'Le mode entraînement est déjà activé. Vous pouvez lancer le prochain round.',
      prepareProfile: 'Préparez votre profil pour lancer les rounds d’entraînement.',
      updateProfile: 'Vous pouvez mettre à jour votre ID d’entraînement et réactiver le profil.',
      startConnecting: 'Activation locale du mode entraînement en cours...',
      connectSuccess: 'ID accepté. Vous pouvez commencer l’entraînement.',
      idlePrompt: 'Appuyez sur Start pour générer un nouveau round.',
      roundStarted: (roundNumber) => `Round #${roundNumber} lancé.`,
      roundFinished: (roundNumber, multiplier) =>
        `Round #${roundNumber} terminé à ${multiplier}.`,
      telegramContinue: 'Continuer',
      telegramActivating: 'Activation...',
    },
    onboarding: {
      title: 'Aviator Signal',
      heroEyebrow: 'Accès signal',
      heroCopy:
        'Dans l’application, vous recevez le signal prêt à l’emploi et voyez à l’avance le point clé du round.',
      insideTitle: 'Ce qu’il y a dedans',
      insideItems: [
        'Nous nous connectons au fournisseur et recevons un signal interne pour le jeu Aviator.',
        'Ensuite, nous vous le transmettons dans l’application afin que vous puissiez l’utiliser dans votre jeu.',
        'La précision de détection de l’issue atteint 99%.',
      ],
      startTitle: 'Comment commencer',
      startItems: [
        'Activez d’abord votre profil d’entraînement avec votre ID.',
        'Après activation, lancez les rounds dans l’application et suivez le multiplicateur sur le site en parallèle.',
        'L’application montrera à l’avance où l’avion va exploser afin que vous puissiez suivre le mouvement du round.',
      ],
      continue: 'Continuer',
    },
    verification: {
      eyebrow: 'Activation',
      title: 'Obtenir l’accès',
      stepLabel: 'Étape',
      step1Text: 'Pour obtenir l’accès, inscrivez-vous obligatoirement via le lien ci-dessous :',
      promoCodeLabel: 'Code promo',
      promoHint: 'Saisissez-le lors de l’inscription pour recevoir l’accès ainsi que jusqu’à 150 Free Spins.',
      step2Title: 'Votre ID sur le site LuckyPari',
      step2Example: 'Exemple : 123456789',
      step2Hint: 'Vous le trouverez sur le site dans votre profil personnel.',
      step3Text: 'Saisissez votre ID ci-dessous pour activer l’accès dans l’application.',
      inputLabel: 'ID sur le site LuckyPari',
      inputPlaceholder: 'Par exemple, 123456789',
      note: 'Après l’envoi de l’ID, la vérification commencera. Cela prend généralement de 5 à 10 secondes.',
      submit: 'Activer l’accès',
      connectingEyebrow: 'Vérification d’accès',
      connectingTitle: 'Connexion du mode de vérification',
      connectingBody: (pendingId) =>
        `ID ${pendingId} accepté. La vérification et l’activation de l’accès pour les prochains rounds sont en cours.`,
      connectingSteps: [
        'Inscription effectuée via le lien',
        'Code promo saisi',
        'Dépôt effectué',
      ],
    },
    game: {
      topline:
        'Appuyez sur Start au même moment que la mise sur le site et obtenez l’instant exact où l’avion termine son vol.',
      start: 'DÉMARRER',
      running: 'VOL...',
      reload: 'RECHARGER',
      waitingStatus: 'En attente de génération',
      flyingStatus: 'Avion en vol',
      explodedStatus: 'Avion explosé',
      exactPoint: 'Point exact',
      flightPoint: 'Point de vol',
      hidden: 'masqué',
    },
    history: {
      eyebrow: 'Journal des rounds',
      title: 'Derniers résultats',
      records: (count) => `${count} entrées`,
      empty: 'L’historique apparaîtra après la fin du premier round d’entraînement.',
      round: (roundNumber) => `Round #${roundNumber}`,
      completed: 'Terminé',
    },
    ticker: {
      eyebrow: 'Flux des résultats',
      title: 'Rythme actuel de la session',
      caption: 'Dernier et prochain round',
      next: 'Suivant',
      emptyLabel: 'Encore vide',
      emptyValue: 'En attente du premier finish',
    },
    insights: {
      eyebrow: 'Analyse d’entraînement',
      title: 'Vue de la session actuelle',
      caption: 'Sans mises réelles',
      completedRounds: 'Rounds terminés',
      averageMultiplier: 'Multiplicateur moyen',
      expectedLength: 'Durée attendue',
      focusEyebrow: 'Focus du round',
      cues: {
        base: {
          title: 'Sprint court',
          description:
            'Le prochain round se terminera vite. C’est un bon moment pour s’habituer à la phase de départ et au rythme de croissance.',
        },
        boosted: {
          title: 'Distance moyenne',
          description:
            'Le round dure plus longtemps que la plage de base. Cela aide à mieux ressentir l’accélération et le rythme visuel.',
        },
        advanced: {
          title: 'Vol long',
          description:
            'Une plage plus élevée et plus rare. Utile pour étudier le comportement du multiplicateur sur une trajectoire plus longue.',
        },
        rare: {
          title: 'Pic élevé rare',
          description:
            'C’est un scénario rare avec une longue phase d’accélération. Il est utile de le garder en mémoire comme référence pour un long round.',
        },
      },
    },
    multiplier: {
      current: 'Multiplicateur actuel',
      targetKnown: 'La cible est connue à l’avance',
      stages: {
        round_idle: 'Round prêt',
        round_running: 'Le multiplicateur monte',
        round_finished: 'Cible atteinte',
      },
    },
    ranges: {
      base: 'Plage de base',
      boosted: 'Plage accélérée',
      advanced: 'Plage avancée',
      rare: 'Plage élevée rare',
      custom: 'Plage personnalisée',
    },
    pilot: 'Pilote',
  },
};

function mapLocaleToLanguage(locale: string): SupportedLanguage | null {
  const normalized = locale.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith('ar')) {
    return 'ar';
  }

  if (
    normalized.startsWith('si') ||
    normalized.startsWith('sin') ||
    normalized.endsWith('-lk')
  ) {
    return 'si';
  }

  if (normalized.startsWith('fr')) {
    return 'fr';
  }

  if (normalized.startsWith('en')) {
    return 'en';
  }

  return null;
}

export function detectSupportedLanguage(
  ...candidates: Array<string | null | undefined>
): SupportedLanguage {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const match = mapLocaleToLanguage(candidate);

    if (match) {
      return match;
    }
  }

  return 'en';
}

export function getTranslations(language: SupportedLanguage): TranslationBundle {
  return translations[language] ?? translations.en;
}

export function getRangeLabel(
  language: SupportedLanguage,
  rangeKey: RangeKey,
): string {
  return getTranslations(language).ranges[rangeKey];
}
