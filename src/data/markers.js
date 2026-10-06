/**
 * Marker approval file.
 * Presence is taken from the company profile and the clients PDF.
 * Those documents name places but do not print latitude or longitude.
 * Coordinates below are geographic estimates so pins can be reviewed.
 * Set approved to false to hide a pin without deleting the record.
 * Arcs are drawn only when both ends have verification "documented-coordinates".
 */
export const markers = [
  {
    id: 'riyadh-office',
    kind: 'office',
    lat: 24.812,
    lon: 46.741,
    label: { ar: 'مكتب الرياض', en: 'Riyadh office' },
    detail: {
      ar: 'قرطبة، شارع خالد بن الوليد، الدور الرابع. العنوان موثّق، والإحداثيات تقدير لحي قرطبة.',
      en: 'Qurtubah, Khalid Bin Waleed Street, 4th floor. The address is documented; the coordinates estimate the neighborhood.',
    },
    source: 'FranchiseME company profile, contact page',
    verification: 'place-confirmed-coordinates-estimated',
    approved: true,
  },
  {
    id: 'riyadh-diplomatic',
    kind: 'project',
    lat: 24.687,
    lon: 46.623,
    label: { ar: 'حي السفارات — مشروع سابق', en: 'Diplomatic Quarter — past project' },
    detail: {
      ar: 'أول فرع للي ماتشو. هذا موقع مشروع سابق وليس مكتب فرنشايزمي.',
      en: 'First Le Machou branch. A previous project location, not a FranchiseME office.',
    },
    source: 'Clients and previous experience PDF, Le Machou',
    verification: 'place-confirmed-coordinates-estimated',
    approved: true,
  },
  {
    id: 'cannes',
    kind: 'project',
    lat: 43.552,
    lon: 7.017,
    label: { ar: 'كان — مشروع سابق', en: 'Cannes — past project' },
    detail: {
      ar: 'منشأ مطعم لي ماتشو. ليس مكتبًا للشركة.',
      en: 'Origin of Le Machou. Not a company office.',
    },
    source: 'Clients and previous experience PDF, Le Machou',
    verification: 'city-named-coordinates-estimated',
    approved: true,
  },
  {
    id: 'bahrain',
    kind: 'project',
    lat: 26.228,
    lon: 50.586,
    label: { ar: 'البحرين — مشروع سابق', en: 'Bahrain — past project' },
    detail: {
      ar: 'غرفة البحرين وتمكين. الملف يذكر البحرين دون شارع، والإحداثيات تقدير للمنامة ويحتاج تأكيدًا.',
      en: 'Bahrain Chamber and Tamkeen. The file names Bahrain, not a street. Coordinates estimate Manama and still need confirmation.',
    },
    source: 'Clients and previous experience PDF, Bahrain Chamber',
    verification: 'country-confirmed-city-estimated',
    approved: true,
  },
  {
    id: 'oman',
    kind: 'project',
    lat: 23.588,
    lon: 58.383,
    label: { ar: 'عُمان — بانتظار مدينة', en: 'Oman — city not confirmed' },
    detail: {
      ar: 'الملف يذكر سلطنة عُمان دون مدينة. الدبوس غير معروض حتى يُعتمد الموقع.',
      en: 'The file names Oman without a city. The pin stays hidden until a place is confirmed.',
    },
    source: 'Clients and previous experience PDF, Oman Chamber',
    verification: 'country-only',
    approved: false,
  },
]

export const visibleMarkers = markers.filter((marker) => marker.approved && Number.isFinite(marker.lat) && Number.isFinite(marker.lon))

export function markerArcs() {
  return []
}
