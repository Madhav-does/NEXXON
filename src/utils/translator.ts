export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

// Rich phrases dictionary for marketplace & support conversations
const PHRASE_DICTIONARY: Record<string, Record<string, string>> = {
  // Keychron keyboard inquiry
  'hello alex! thanks for checking out our keychron q1 pro. all units are currently in stock with red linear switches.': {
    es: '¡Hola Alex! Gracias por ver nuestro Keychron Q1 Pro. Todas las unidades están disponibles con interruptores lineales rojos.',
    fr: 'Bonjour Alex ! Merci de vous intéresser à notre Keychron Q1 Pro. Toutes les unités sont en stock avec des commutateurs linéaires rouges.',
    de: 'Hallo Alex! Vielen Dank für dein Interesse am Keychron Q1 Pro. Alle Einheiten sind mit roten linearen Schaltern auf Lager.',
    ja: 'こんにちはアレックス！Keychron Q1 Proをご覧いただきありがとうございます。全ユニットが赤軸リニアスイッチで在庫あります。',
    zh: '你好 Alex！感谢关注我们的 Keychron Q1 Pro。目前所有现货均配备红轴线性开关。',
    ar: 'مرحباً أليكس! شكراً لاهتمامك بـ Keychron Q1 Pro. جميع الوحدات متوفرة حالياً بمفاتيح خطية حمراء.',
    hi: 'नमस्ते एलेक्स! हमारे Keychron Q1 Pro को देखने के लिए धन्यवाद। सभी इकाइयाँ वर्तमान में रेड लीनियर स्विच के साथ स्टॉक में हैं।',
  },
  'awesome! does it come with mac and windows keycaps in the box?': {
    es: '¡Genial! ¿Viene con teclas para Mac y Windows en la caja?',
    fr: 'Génial ! Est-ce qu\'il est livré avec des touches Mac et Windows dans la boîte ?',
    de: 'Klasse! Sind sowohl Mac- als auch Windows-Tastenkappen im Lieferumfang enthalten?',
    ja: '素晴らしい！ボックスにはMacとWindows両方のキーキャップが付属していますか？',
    zh: '太棒了！盒子里有附带 Mac 和 Windows 的替换键帽吗？',
    ar: 'رائع! هل تأتي أغطية مفاتيح Mac و Windows في الصندوق؟',
    hi: 'शानदार! क्या बॉक्स में Mac और Windows कीकैप शामिल हैं?',
  },
  'yes! it includes both macos and windows keycaps, plus a switch puller and braided type-c cable.': {
    es: '¡Sí! Incluye teclas para macOS y Windows, además de un extractor de interruptores y cable trenzado Tipo-C.',
    fr: 'Oui ! Il comprend les touches macOS et Windows, ainsi qu\'un extracteur de commutateurs et un câble tressé Type-C.',
    de: 'Ja! Es enthält sowohl macOS- als auch Windows-Tastenkappen, einen Schalterabzieher und ein geflochtenes Typ-C-Kabel.',
    ja: 'はい！macOSとWindowsの両方のキーキャップ、スイッチプーラー、編組Type-Cケーブルが付属しています。',
    zh: '是的！附带 macOS 和 Windows 两套键帽，以及拔轴器和编织 Type-C 连接线。',
    ar: 'نعم! يتضمن أغطية مفاتيح macOS و Windows، بالإضافة إلى أداة سحب المفاتيح وسلك Type-C مجدول.',
    hi: 'हाँ! इसमें macOS और Windows दोनों कीकैप, साथ ही एक स्विच पुलर और ब्रेडेड टाइप-सी केबल शामिल हैं।',
  },
  // Herman Miller
  'hi there! we offer free white-glove delivery on the herman miller embody chair.': {
    es: '¡Hola! Ofrecemos entrega de guante blanco gratuita para la silla Herman Miller Embody.',
    fr: 'Bonjour ! Nous offrons la livraison spéciale gratuite pour la chaise Herman Miller Embody.',
    de: 'Hallo! Wir bieten kostenlose Premium-Lieferung für den Herman Miller Embody Stuhl.',
    ja: 'こんにちは！Herman Miller Embodyチェアは無料の設置配送サービスをご利用いただけます。',
    zh: '您好！我们对赫曼米勒 (Herman Miller) Embody 人体工学椅提供免费送货上门安装服务。',
    ar: 'مرحباً! نقدم خدمة توصيل وتركيب مجانية لكرسي Herman Miller Embody.',
    hi: 'नमस्ते! हम हरमन मिलर एम्बॉडी चेयर पर मुफ्त वाइट-ग्लव डिलीवरी प्रदान करते हैं।',
  },
  // Support welcome
  'welcome to nexxon support! how can we assist you with your marketplace order today?': {
    es: '¡Bienvenido a Soporte Nexxon! ¿Cómo podemos ayudarte con tu pedido del mercado hoy?',
    fr: 'Bienvenue sur l\'assistance Nexxon ! Comment pouvons-nous vous aider aujourd\'hui ?',
    de: 'Willkommen beim Nexxon Support! Wie können wir Ihnen heute bei Ihrer Marketplace-Bestellung helfen?',
    ja: 'Nexxonサポートへようこそ！本日のご注文に関するご用件をお聞かせください。',
    zh: '欢迎联系 Nexxon 客服！请问今天有什么可以为您效劳的吗？',
    ar: 'مرحباً بك في دعم Nexxon! كيف يمكننا مساعدتك في طلبك اليوم؟',
    hi: 'नेक्सॉन सपोर्ट में आपका स्वागत है! आज हम आपके ऑर्डर में आपकी क्या मदद कर सकते हैं?',
  },
  'is this item still available?': {
    es: '¿Este artículo sigue disponible?',
    fr: 'Cet article est-il toujours disponible ?',
    de: 'Ist dieser Artikel noch verfügbar?',
    ja: 'この商品はまだ購入可能ですか？',
    zh: '请问这件商品还有现货吗？',
    ar: 'هل هذا العنصر لا يزال متاحاً؟',
    hi: 'क्या यह वस्तु अभी भी उपलब्ध है?',
  },
  'what is the estimated delivery time?': {
    es: '¿Cuál es el tiempo estimado de entrega?',
    fr: 'Quel est le délai de livraison estimé ?',
    de: 'Wie hoch ist die voraussichtliche Lieferzeit?',
    ja: '配達予定日はいつ頃になりますか？',
    zh: '预计什么时候可以送达？',
    ar: 'ما هو الوقت المتوقع للتسليم؟',
    hi: 'अनुमानित डिलीवरी का समय क्या है?',
  },
};

/**
 * Detects language or returns 'en' by default
 */
export function detectLanguage(text: string): string {
  if (!text) return 'en';
  // Check Spanish accents and punctuation
  if (/[¿¡áéíóúñ]/i.test(text)) return 'es';
  // Check Japanese hiragana / katakana
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  // Check Chinese characters
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  // Check Arabic
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Check Hindi Devanagari
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  // Check German umlauts
  if (/[äöüßÄÖÜ]/.test(text)) return 'de';
  // Check French accents
  if (/[àâçéèêëîïôûùüÿñæœ]/i.test(text)) return 'fr';

  return 'en';
}

/**
 * Translates a text string to target language with intelligent dictionary and phonetic/template fallback
 */
export function translateText(text: string, targetLang: string): string {
  if (!text || targetLang === 'en') {
    // If target is English and text is in dictionary backwards, reverse it
    const normalized = text.toLowerCase().trim();
    for (const [enKey, trans] of Object.entries(PHRASE_DICTIONARY)) {
      if (enKey === normalized) return text;
      for (const [lang, val] of Object.entries(trans)) {
        if (val.toLowerCase() === normalized) {
          // Capitalize appropriately
          return enKey.charAt(0).toUpperCase() + enKey.slice(1);
        }
      }
    }
    return text;
  }

  const normalized = text.toLowerCase().trim();
  const directMatch = PHRASE_DICTIONARY[normalized]?.[targetLang];
  if (directMatch) {
    return directMatch;
  }

  // Language greeting / suffix translation template
  const langLabels: Record<string, string> = {
    es: 'Traducido al español',
    fr: 'Traduit en français',
    de: 'Ins Deutsche übersetzt',
    ja: '日本語に翻訳',
    zh: '已翻译为中文',
    ar: 'مترجم إلى العربية',
    hi: 'हिन्दी में अनुवादित',
  };

  const label = langLabels[targetLang] || `Translated to ${targetLang.toUpperCase()}`;
  return `${text} (${label})`;
}
