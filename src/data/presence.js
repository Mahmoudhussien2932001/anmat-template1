import { company } from './company.js'
import { markers } from './markers.js'

/**
 * Map records for the reach panel.
 * Places come from the company profile and the clients file.
 * Those files name the places and do not print latitude or longitude.
 * Coordinates below are the geographic position of the named place, kept only
 * when markers.js has already approved the pin.
 * Oman stays out: the file names the country and no city.
 * The Riyadh inspection center is named without a district, so it is not pinned.
 * Connection lines stay empty: none of the records has surveyed coordinates
 * for both ends of a route.
 */
const summaries = {
  'riyadh-office': {
    type: 'office',
    name: { ar: 'مكتب الرياض', en: 'Riyadh office' },
    summary: {
      ar: 'المكتب في قرطبة، شارع خالد بن الوليد، الدور الرابع. هذا موقع المكتب وليس مشروعًا سابقًا.',
      en: 'The office is in Qurtubah, Khalid Bin Waleed Street, 4th floor. This is the office, not a previous project.',
    },
    map: 'gulf',
    label: [-108, -30],
    pin: { ar: 'مكتب الرياض', en: 'Riyadh office' },
  },
  'riyadh-diplomatic': {
    type: 'project',
    name: { ar: 'حي السفارات', en: 'Diplomatic Quarter' },
    summary: {
      ar: 'موقع مشروع سابق: أول فرع للي ماتشو في الرياض. ليس مكتبًا لفرنشايزمي ولا فرعًا للشركة.',
      en: 'A previous project location: the first Le Machou branch in Riyadh. Not a FranchiseME office or company branch.',
    },
    map: 'gulf',
    label: [16, 58],
    pin: { ar: 'حي السفارات', en: 'Diplomatic Quarter' },
  },
  bahrain: {
    type: 'project',
    name: { ar: 'البحرين', en: 'Bahrain' },
    summary: {
      ar: 'مشروع سابق مع غرفة البحرين وتمكين. الملف يذكر البحرين دون شارع، والدبوس يقدّر المنامة.',
      en: 'A previous project with the Bahrain Chamber and Tamkeen. The file names Bahrain without a street, and the pin estimates Manama.',
    },
    map: 'gulf',
    label: [34, -26],
    pin: { ar: 'البحرين', en: 'Bahrain' },
  },
  cannes: {
    type: 'project',
    name: { ar: 'كان، فرنسا', en: 'Cannes, France' },
    summary: {
      ar: 'موقع مشروع سابق: منشأ مطعم لي ماتشو. يظهر في خريطة فرنسا لأنه خارج إطار الخليج. ليس مكتبًا للشركة.',
      en: 'A previous project location: the origin of Le Machou. It is shown on the France map because it sits outside the Gulf frame. Not a company office.',
    },
    map: 'france',
    label: [-40, -18],
    pin: { ar: 'كان', en: 'Cannes' },
  },
}

export const presenceLocations = markers
  .filter((marker) => marker.approved && summaries[marker.id])
  .map((marker) => {
    const copy = summaries[marker.id]
    return {
      id: marker.id,
      type: copy.type,
      name: copy.name,
      summary: copy.summary,
      coordinates: { lat: marker.lat, lon: marker.lon },
      map: copy.map,
      label: copy.label,
      pin: copy.pin,
      source: marker.source,
      verification: marker.verification,
      contact: marker.id === 'riyadh-office'
        ? {
          phone: company.phone,
          phoneHref: company.phoneHref,
          email: company.email,
          address: { ar: company.address, en: company.addressEn },
        }
        : null,
    }
  })

export const presenceLinks = []

export const presenceGap = {
  ar: 'الملف يسمّي الأماكن دون إحداثيات مساحية. عُمان مذكورة بلا مدينة، لذلك لا تظهر دبوسًا. لا يُرسم خط ربط لأن المسار غير موثّق.',
  en: 'The file names these places without surveyed coordinates. Oman is named without a city, so it is not pinned. No link is drawn, because a route was not documented.',
}
