export type ServiceType = 'auto-rickshaw' | 'taxi' | 'guide' | 'shop';

export interface VerifiedRate {
  id: string;
  service: ServiceType;
  city: string;
  route: string;
  standardFare: number;
  unit: string;
  notes: string;
  keywords: string[];
}

// Government-approved / municipal / verified local rates
// Stored locally for offline fallback
export const verifiedRates: VerifiedRate[] = [
  // Auto-rickshaw
  { id: 'auto-agra-taj-fort', service: 'auto-rickshaw', city: 'Agra', route: 'Taj Mahal → Agra Fort', standardFare: 50, unit: 'trip', notes: 'Metered fare + ₹10 luggage. Prepaid booths available at Taj parking.', keywords: ['taj', 'fort', 'agra'] },
  { id: 'auto-agra-station-taj', service: 'auto-rickshaw', city: 'Agra', route: 'Agra Cantt Station → Taj Mahal', standardFare: 80, unit: 'trip', notes: 'Prepaid auto counter outside station. Avoid touts.', keywords: ['station', 'taj', 'railway', 'cantt'] },
  { id: 'auto-jaipur-amber', service: 'auto-rickshaw', city: 'Jaipur', route: 'City Center → Amber Fort', standardFare: 150, unit: 'trip', notes: 'Shared autos available for ₹40/person.', keywords: ['amber', 'fort', 'jaipur', 'city'] },
  { id: 'auto-varanasi-ghats', service: 'auto-rickshaw', city: 'Varanasi', route: 'Station → Dashashwamedh Ghat', standardFare: 60, unit: 'trip', notes: 'E-rickshaws also available for ₹30.', keywords: ['station', 'ghat', 'dashashwamedh', 'varanasi'] },
  { id: 'auto-delhi-connaught', service: 'auto-rickshaw', city: 'Delhi', route: 'Connaught Place → India Gate', standardFare: 45, unit: 'trip', notes: 'Delhi Transport Authority meter rate.', keywords: ['connaught', 'india gate', 'cp', 'delhi'] },
  { id: 'auto-delhi-station-jama', service: 'auto-rickshaw', city: 'Delhi', route: 'New Delhi Station → Jama Masjid', standardFare: 50, unit: 'trip', notes: 'Prepaid auto stand at station exit.', keywords: ['station', 'jama', 'masjid', 'delhi', 'new'] },
  { id: 'auto-jaipur-station-pink', service: 'auto-rickshaw', city: 'Jaipur', route: 'Jaipur Station → Pink City', standardFare: 100, unit: 'trip', notes: 'Metered fare per Rajasthan Transport rules.', keywords: ['station', 'pink city', 'jaipur'] },
  { id: 'auto-hampi-virupaksha', service: 'auto-rickshaw', city: 'Hampi', route: 'Hampi Bus Stand → Virupaksha Temple', standardFare: 30, unit: 'trip', notes: 'Short distance. Walkable in 15 min.', keywords: ['hampi', 'bus', 'virupaksha', 'temple'] },

  // Taxi
  { id: 'taxi-agra-airport-taj', service: 'taxi', city: 'Agra', route: 'Kheria Airport → Taj Mahal', standardFare: 250, unit: 'trip', notes: 'UP Tourism approved taxi counter at airport.', keywords: ['airport', 'taj', 'kheria', 'agra'] },
  { id: 'taxi-jaipur-airport-city', service: 'taxi', city: 'Jaipur', route: 'Airport → City Center', standardFare: 350, unit: 'trip', notes: 'Rajasthan Tourism approved rates.', keywords: ['airport', 'city', 'jaipur'] },
  { id: 'taxi-delhi-airport-connaught', service: 'taxi', city: 'Delhi', route: 'IGI Airport → Connaught Place', standardFare: 400, unit: 'trip', notes: 'Delhi Traffic Police approved fare. Mega/Meru cabs.', keywords: ['airport', 'igi', 'connaught', 'cp', 'delhi'] },
  { id: 'taxi-varanasi-airport-ghat', service: 'taxi', city: 'Varanasi', route: 'Lal Bahadur Airport → Ghats', standardFare: 500, unit: 'trip', notes: 'UP Tourism approved taxi.', keywords: ['airport', 'ghat', 'varanasi', 'lal bahadur'] },

  // Guide
  { id: 'guide-agra-taj-halfday', service: 'guide', city: 'Agra', route: 'Taj Mahal + Agra Fort (half day)', standardFare: 500, unit: 'session', notes: 'Approved by Agra Tourism Office. Guide ID card required.', keywords: ['taj', 'fort', 'guide', 'agra', 'half'] },
  { id: 'guide-agra-fullday', service: 'guide', city: 'Agra', route: 'Full day Agra tour', standardFare: 1000, unit: 'session', notes: 'Ministry of Tourism licensed guide.', keywords: ['full day', 'guide', 'agra'] },
  { id: 'guide-jaipur-fullday', service: 'guide', city: 'Jaipur', route: 'Full day Jaipur tour', standardFare: 1200, unit: 'session', notes: 'Rajasthan Tourism approved guide rate.', keywords: ['full day', 'guide', 'jaipur'] },
  { id: 'guide-varanasi-walking', service: 'guide', city: 'Varanasi', route: 'Walking tour of Ghats (2 hrs)', standardFare: 400, unit: 'session', notes: 'Varanasi Guide Association rate.', keywords: ['walking', 'ghat', 'guide', 'varanasi'] },
  { id: 'guide-hampi-fullday', service: 'guide', city: 'Hampi', route: 'Full day Hampi ruins tour', standardFare: 800, unit: 'session', notes: 'Karnataka Tourism approved guide.', keywords: ['full day', 'guide', 'hampi'] },

  // Shop / Souvenir
  { id: 'shop-agra-marble', service: 'shop', city: 'Agra', route: 'Marble inlay coaster set (4 pieces)', standardFare: 300, unit: 'item', notes: 'Agra Marble Emporium verified price range.', keywords: ['marble', 'coaster', 'inlay', 'agra'] },
  { id: 'shop-agra-marble-plate', service: 'shop', city: 'Agra', route: 'Marble inlay plate (8 inch)', standardFare: 500, unit: 'item', notes: 'Verified at government-approved emporiums.', keywords: ['marble', 'plate', 'inlay', 'agra'] },
  { id: 'shop-jaipur-blue-pottery', service: 'shop', city: 'Jaipur', route: 'Blue pottery vase (medium)', standardFare: 250, unit: 'item', notes: 'Jaipur Blue Pottery Artisan Association rate.', keywords: ['blue', 'pottery', 'vase', 'jaipur'] },
  { id: 'shop-jaipur-block-print', service: 'shop', city: 'Jaipur', route: 'Block-printed cotton scarf', standardFare: 200, unit: 'item', notes: 'Verified at Anokhi / block-print cooperatives.', keywords: ['block', 'print', 'scarf', 'cotton', 'jaipur'] },
  { id: 'shop-varanasi-silk-scarf', service: 'shop', city: 'Varanasi', route: 'Banarasi silk scarf (small)', standardFare: 350, unit: 'item', notes: 'Varanasi Silk Weavers Association verified price.', keywords: ['silk', 'scarf', 'banarasi', 'varanasi'] },
  { id: 'shop-varanasi-silk-saree', service: 'shop', city: 'Varanasi', route: 'Banarasi silk saree (pure)', standardFare: 3500, unit: 'item', notes: 'Government emporium verified. Always ask for silk mark.', keywords: ['silk', 'saree', 'banarasi', 'varanasi'] },
  { id: 'shop-kerala-spices', service: 'shop', city: 'Kerala', route: 'Cardamom (100g pack)', standardFare: 120, unit: 'item', notes: 'Spice Board of India verified retail price.', keywords: ['cardamom', 'spice', 'kerala'] },
  { id: 'shop-kerela-tea', service: 'shop', city: 'Kerala', route: 'Tea (100g premium pack)', standardFare: 80, unit: 'item', notes: 'Tea Board verified retail price.', keywords: ['tea', 'kerala'] },
];

// Negotiation phrases in multiple languages
export const negotiationPhrases: Record<string, { lang: string; phrase: string; translation: string }> = {
  '50': {
    lang: 'Hindi',
    phrase: 'स्टैंडर्ड किराया पचास रुपये है। क्या हम ऑफिशियल रेट पर चल सकते हैं?',
    translation: 'The standard fare is ₹50. Can we go at the official rate?',
  },
  '80': {
    lang: 'Hindi',
    phrase: 'ऑफिशियल रेट अस्सी रुपये है। यही भुगतान करूँगा।',
    translation: 'The official rate is ₹80. I will pay that amount.',
  },
  '150': {
    lang: 'Hindi',
    phrase: 'सरकारी दर डेढ़ सौ रुपये है। इसी दर पर तय करें।',
    translation: 'The government rate is ₹150. Let us settle on this rate.',
  },
};

export function findMatchingRate(transcript: string, location?: string): VerifiedRate | null {
  const lower = transcript.toLowerCase();
  const words = lower.split(/\s+/);

  // Try to match by keywords in the transcript
  let bestMatch: VerifiedRate | null = null;
  let bestScore = 0;

  for (const rate of verifiedRates) {
    let score = 0;
    for (const keyword of rate.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.split(' ').length; // multi-word keywords score higher
      }
    }
    // Boost score if location matches
    if (location && rate.city.toLowerCase().includes(location.toLowerCase())) {
      score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rate;
    }
  }

  return bestScore >= 1 ? bestMatch : null;
}

// Extract numbers (prices) from a transcript
// Handles: "250", "two hundred fifty", "पचासी", "250 rupees", "₹250"
const numberWords: Record<string, number> = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60,
  'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100,
  'thousand': 1000,
  // Hindi numbers
  'Ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5,
  'chhe': 6, 'saat': 7, 'aath': 8, 'nao': 9, 'das': 10,
  'bees': 20, 'tees': 30, 'chaalis': 40, 'pachaas': 50, 'saath': 60,
  'sattar': 70, 'assi': 80, 'nabbe': 90, 'sau': 100,
  'pachas': 50, 'so': 100, 'hazaar': 1000,
};

export function extractPrice(transcript: string): number | null {
  const lower = transcript.toLowerCase();

  // Try numeric extraction: ₹250, 250 rupees, 250 rupaye
  const numericMatches = lower.match(/(?:₹|rs\.?|rupees?|rupaye?)\s*(\d{1,6})|(\d{1,6})\s*(?:₹|rs\.?|rupees?|rupaye?)/g);
  if (numericMatches) {
    for (const match of numericMatches) {
      const num = match.replace(/[^\d]/g, '');
      const val = parseInt(num, 10);
      if (val > 0) return val;
    }
  }

  // Try plain numbers in context of price-related words
  const priceContext = lower.match(/(?:fare|price|rate|cost|charge|kitna|kitne|paisa|paise|dama|dam)\s*(?:\d{1,6})|(\d{1,6})\s*(?:fare|price|rate|cost|charge|rupees?|rupaye?|ka|ke)/g);
  if (priceContext) {
    for (const match of priceContext) {
      const num = match.replace(/[^\d]/g, '');
      const val = parseInt(num, 10);
      if (val > 0) return val;
    }
  }

  // Try standalone large numbers (likely a price if > 10)
  const standalone = lower.match(/\b(\d{2,6})\b/g);
  if (standalone) {
    const vals = standalone.map((s) => parseInt(s, 10)).filter((v) => v >= 15);
    if (vals.length > 0) return Math.max(...vals);
  }

  // Try word-based numbers
  const words = lower.split(/\s+/);
  let total = 0;
  let currentVal = 0;
  let foundWord = false;

  for (const word of words) {
    const clean = word.replace(/[.,!?]/g, '');
    if (numberWords[clean] !== undefined) {
      const n = numberWords[clean];
      if (n === 100 || n === 1000) {
        currentVal = (currentVal || 1) * n;
        total = currentVal;
        foundWord = true;
      } else {
        currentVal += n;
      }
    } else if (foundWord && currentVal > 0) {
      total = currentVal;
      break;
    }
  }

  if (foundWord && total > 0) return total;

  return null;
}

export function detectService(transcript: string): ServiceType | null {
  const lower = transcript.toLowerCase();
  if (/(auto|rickshaw|ricksha|auto-rickshaw|riksha)/.test(lower)) return 'auto-rickshaw';
  if (/(taxi|cab|car|ola|uber)/.test(lower)) return 'taxi';
  if (/(guide|tour guide|darshan|guide wala)/.test(lower)) return 'guide';
  if (/(shop|souvenir|buy|purchase|market|bazaar|market|price|cost|dama|dam)/.test(lower)) return 'shop';
  return null;
}

export function calculateDifference(standard: number, asked: number): { percent: number; isOvercharging: boolean; severity: 'low' | 'moderate' | 'high' } {
  if (standard <= 0) return { percent: 0, isOvercharging: false, severity: 'low' };
  const percent = Math.round(((asked - standard) / standard) * 100);
  const isOvercharging = percent >= 50;
  let severity: 'low' | 'moderate' | 'high' = 'low';
  if (percent >= 200) severity = 'high';
  else if (percent >= 100) severity = 'moderate';
  else if (percent >= 50) severity = 'low';
  return { percent, isOvercharging, severity };
}
