/**
 * Investor globe markets from the FranchiseME-3D scene.
 * City centers are the coordinates in that file. No extra markets are added.
 * English names are the same cities, for the English page.
 */

const markets = [
  { id: 'riyadh', lon: 46.675, lat: 24.714, name: { ar: 'الرياض', en: 'Riyadh' }, market: { ar: 'السعودية', en: 'Saudi Arabia' } },
  { id: 'cairo', lon: 31.235, lat: 30.044, name: { ar: 'القاهرة', en: 'Cairo' }, market: { ar: 'مصر', en: 'Egypt' } },
  { id: 'dubai', lon: 55.27, lat: 25.2, name: { ar: 'دبي', en: 'Dubai' }, market: { ar: 'الإمارات', en: 'United Arab Emirates' } },
  { id: 'paris', lon: 2.35, lat: 48.86, name: { ar: 'باريس', en: 'Paris' }, market: { ar: 'فرنسا', en: 'France' } },
  { id: 'mumbai', lon: 72.88, lat: 19.08, name: { ar: 'مومباي', en: 'Mumbai' }, market: { ar: 'الهند', en: 'India' } },
  { id: 'london', lon: -0.12, lat: 51.51, name: { ar: 'لندن', en: 'London' }, market: { ar: 'بريطانيا', en: 'Britain' } },
  { id: 'singapore', lon: 103.82, lat: 1.35, name: { ar: 'سنغافورة', en: 'Singapore' }, market: { ar: 'سنغافورة', en: 'Singapore' } },
]

export function buildInvestorMarkets(english, narrow) {
  const lang = english ? 'en' : 'ar'
  const shown = narrow ? markets.slice(0, 5) : markets
  return shown.map((market) => ({
    id: market.id,
    lat: market.lat,
    lng: market.lon,
    shape: 'market',
    label: market.name[lang],
    location: market.market[lang],
    kicker: english ? 'Exploring markets' : 'استكشاف الأسواق',
    closeLabel: english ? 'Close' : 'إغلاق البطاقة',
  }))
}
