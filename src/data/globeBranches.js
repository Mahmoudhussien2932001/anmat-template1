import { company } from './company.js'
import { markers } from './markers.js'

/**
 * Globe pins for places the company profile actually names.
 * Coordinates are the estimates already recorded in markers.js.
 * The Riyadh office is the only site with contact details.
 * The Diplomatic Quarter sits in the same city, so it is described on the
 * Riyadh card instead of a second pin that would cover the office.
 * Oman stays off the globe: the profile names the country and no city.
 */

const plates = {
  'riyadh-office': '/images/places/riyadh.svg',
  bahrain: '/images/places/bahrain.svg',
  cannes: '/images/places/cannes.svg',
}

const copy = {
  'riyadh-office': {
    location: {
      ar: 'قرطبة، شارع خالد بن الوليد، الدور الرابع، الرياض',
      en: 'Qurtubah, Khalid Bin Waleed Street, 4th floor, Riyadh',
    },
    note: {
      ar: 'حي السفارات موثّق في الملف كأول فرع لمشروع لي ماتشو في الرياض. ليس مكتبًا ثانيًا للشركة، لذلك لا يظهر دبوسًا منفصلًا.',
      en: 'The Diplomatic Quarter is documented as the first Le Machou project branch in Riyadh. It is not a second company office, so it is not a separate pin.',
    },
  },
  bahrain: {
    location: {
      ar: 'البحرين. الملف لا يذكر شارعًا، والدبوس يقدّر المنامة.',
      en: 'Bahrain. The profile names no street, and the pin estimates Manama.',
    },
    note: {
      ar: 'مشروع سابق مع غرفة البحرين وتمكين. لا توجد بيانات اتصال خاصة بهذا الموقع.',
      en: 'A past project with the Bahrain Chamber and Tamkeen. No contact details are listed for this place.',
    },
  },
  cannes: {
    location: {
      ar: 'كان، فرنسا',
      en: 'Cannes, France',
    },
    note: {
      ar: 'منشأ مطعم لي ماتشو. مشروع سابق، وليس مكتبًا للشركة، ولا يملك بيانات اتصال خاصة.',
      en: 'Origin of Le Machou. A past project, not a company office, and it has no contact details of its own.',
    },
  },
}

export function buildGlobeMarkers(english) {
  const lang = english ? 'en' : 'ar'
  return markers
    .filter((marker) => marker.approved && plates[marker.id])
    .map((marker) => {
      const text = copy[marker.id]
      const office = marker.id === 'riyadh-office'
      return {
        id: marker.id,
        lat: marker.lat,
        lng: marker.lon,
        src: plates[marker.id],
        label: marker.label[lang],
        kind: office ? 'office' : 'project',
        location: text.location[lang],
        note: text.note[lang],
        address: office ? (english ? company.addressEn : company.address) : '',
        phone: office ? company.phone : '',
        phoneHref: office ? company.phoneHref : '',
        email: office ? company.email : '',
      }
    })
}
