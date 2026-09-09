/**
 * Branch data.
 *
 * Addresses, phone numbers, emails and ordering destinations were read off
 * tastygyros.co.uk and its contact page. Two things were corrected on the way:
 *
 *  1. The live site's nav labels the Notting Hill branch "Notting Hiil".
 *  2. Its Notting Hill collection link points at www.toasttab.com/... , which
 *     301s to the order.toasttab.com/online/... address used here. Verified by
 *     following the redirect rather than trusting the label.
 *
 * Hours: the contact page's own two statements disagree for Notting Hill
 * (11:00–23:00 in the branch panel, 11:00–22:00 in the site footer). The
 * footer figure is used for both branches because it is the one the site
 * states consistently, and the copy points people at the live menu rather
 * than presenting hours as guaranteed.
 */
export const locations = [
  {
    id: 'enfield',
    name: 'Enfield Town',
    shortName: 'Enfield',
    addressLines: ['54 Church Street', 'Enfield Town, London', 'EN2 6AX'],
    postcode: 'EN2 6AX',
    tel: '020 8363 0625',
    telHref: 'tel:+442083630625',
    email: 'tastygyros54@gmail.com',
    hours: 'Monday–Sunday · 11:00–22:00',
    orderUrl: 'https://order.toasttab.com/online/54-church-street',
    orderLabel: 'Toast',
    deliveryUrl: 'https://www.order.store/store/tasty-gyros/xMXAlHC0SBKycuTQbkdaXA',
    deliveryLabel: 'Uber Eats',
    mapsUrl: 'https://maps.app.goo.gl/EMHX2eKcaHHhaBEv8',
    image: 'loc-enfield',
    alt: 'Chicken gyros wrap meal from Tasty Gyros with a portion of fries and a drink.',
    note: 'A few doors from Enfield Town station, in the middle of the market town.',
  },
  {
    id: 'notting-hill',
    name: 'Notting Hill Gate',
    shortName: 'Notting Hill',
    addressLines: ['44 Notting Hill Gate', 'London', 'W11 3HX'],
    postcode: 'W11 3HX',
    tel: '020 4568 8021',
    telHref: 'tel:+442045688021',
    email: 'tastygyros44@gmail.com',
    hours: 'Monday–Sunday · 11:00–22:00',
    orderUrl: 'https://order.toasttab.com/online/tasty-gyros-44-notting-hill',
    orderLabel: 'Toast',
    deliveryUrl: 'https://www.order.store/store/tasty-gyros/46c97bpFWAqqIzNyw6G0Vw',
    deliveryLabel: 'Uber Eats',
    mapsUrl: 'https://maps.app.goo.gl/vTaJjoFCeR56CUgS8',
    image: 'loc-notting-hill',
    alt: 'Halloumi wrap meal from Tasty Gyros with fries and a bottled drink.',
    note: 'On Notting Hill Gate, minutes from the Tube and Portobello Road.',
  },
];

export const INSTAGRAM_URL = 'https://www.instagram.com/tasty_gyros_/';
export const INSTAGRAM_HANDLE = '@tasty_gyros_';
export const FACEBOOK_URL = 'https://www.facebook.com/Gyrosuk';
export const TIKTOK_URL = 'https://www.tiktok.com/@tastygyros';
export const ALLERGEN_URL = 'https://www.tastygyros.co.uk/allergen';
export const SITE_URL = 'https://www.tastygyros.co.uk/';
export const COMPANY_REG = '12912268';
