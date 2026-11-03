// Local visual assets. Replace these paths to update the temporary artwork.
export const media = {
  logo: '/principalPage/icons/rippio-food.svg',
  mascot: '/icons/rippioIcon.png',
  happy: '/icons/rippioFoodHappyIcon.png',
  user: '/media/illustrations/user.svg',
  restaurant: '/media/illustrations/restaurant.svg',
  card: '/media/illustrations/payment-card.svg',
  food: Object.fromEntries(
    [
      'pizza',
      'burger',
      'sushi',
      'salad',
      'rice',
      'pasta',
      'fish',
      'sandwich',
      'chicken',
      'dessert',
      'drink',
      'restaurant',
      'table',
      'city',
    ].map((name) => [name, `/media/food/${name}.webp`]),
  ),
  hero: [1, 2, 3, 4].map(
    (index) => `/principalPage/searchSection/food${index}.png`,
  ),
  heroBackground: '/principalPage/searchSection/foodbackground.png',
  wood: '/principalPage/teamSection/background.png',
  waves: '/media/illustrations/waves.svg',
  profileBackground: '/media/illustrations/profile-pattern.svg',
  loginBackground: '/media/illustrations/login-background.svg',
  infoWaves: [1, 2, 3].map(
    (index) => `/media/illustrations/info-wave-${index}.svg`,
  ),
  planBackground: '/principalPage/planSection/background.png',
  plans: Object.fromEntries(
    ['basic', 'plus', 'premium'].map((name) => [
      name,
      `/media/illustrations/plan-${name}.svg`,
    ]),
  ),
  medals: Object.fromEntries(
    ['gold', 'silver', 'bronze'].map((name) => [
      name,
      `/media/illustrations/medal-${name}.svg`,
    ]),
  ),
  crown: 'icon:crown',
  franchises: {
    visa: '/media/illustrations/visa.svg',
    mastercard: '/media/illustrations/mastercard.svg',
    amex: '/media/illustrations/amex.svg',
  },
  icons: Object.fromEntries(
    [
      'settings',
      'location',
      'payment',
      'credits',
      'clock',
      'orders',
      'help',
      'plus',
      'minus',
      'cart',
      'cart-full',
      'user',
      'search',
      'send',
      'edit',
      'chevron-up',
      'chevron-down',
      'loader',
      'star',
      'menu',
      'lock',
      'empty-cart',
      'salary',
      'shield',
      'courier',
      'sad',
      'image',
    ].map((name) => [name, `icon:${name}`]),
  ),
};

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const foodRules = [
  [/bebida|jugo|gaseosa|agua|cafe|\bte\b|limonada|smoothie/, 'drink'],
  [/pizza|domino/, 'pizza'],
  [/hamburg|burger|mcdonald/, 'burger'],
  [/sandwich|subway|burrito|wrap|taco|qbano/, 'sandwich'],
  [/sushi|asiatica|wok|ramen/, 'sushi'],
  [/ensalada|vegana|vegetal|huerta|salad/, 'salad'],
  [/arroz|rice/, 'rice'],
  [/pasta|spaghetti|espagueti|lasana/, 'pasta'],
  [/postre|helado|donut|crepe|torta|popsy|dunkin/, 'dessert'],
  [/marisco|pescado|fish|salmon|camaron/, 'fish'],
  [/pollo|alita|chicken|kfc|frisby/, 'chicken'],
];

export function foodPhoto(name, category) {
  for (const value of [name, category]) {
    const match = foodRules.find(([pattern]) => pattern.test(normalize(value)));
    if (match) return media.food[match[1]];
  }
  return media.food.table;
}

export function isLegacyImage(src) {
  if (typeof src !== 'string') return false;
  try {
    const url = new URL(src);
    return (
      ['firebasestorage.googleapis.com', 'storage.googleapis.com'].includes(
        url.hostname,
      ) &&
      /(?:^|\/)rippio\.appspot\.com(?:\/|$)/.test(
        decodeURIComponent(url.pathname),
      )
    );
  } catch {
    return false;
  }
}

export function fallbackImage(kind, name, category) {
  if (kind === 'avatar') return media.user;
  if (kind === 'restaurant') return media.restaurant;
  if (kind === 'payment-card') return media.card;
  if (kind === 'logo') return media.logo;
  if (kind === 'illustration') return media.happy;
  return foodPhoto(name, category);
}

export function resolveImageSource(src, fallback) {
  return typeof src === 'string' && src.trim() && !isLegacyImage(src)
    ? src
    : fallback;
}
