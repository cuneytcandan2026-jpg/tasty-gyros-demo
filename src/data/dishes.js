/**
 * Menu content.
 *
 * Names, descriptions, dietary marks and calorie figures are all taken from
 * Tasty Gyros' own published menu on tastygyros.co.uk. The `shout` line is
 * brand voice written for this concept — it describes the dish, it never
 * claims popularity, awards or provenance. Prices are deliberately absent:
 * they are not published on the site and vary by branch, so there is nothing
 * to state accurately.
 */

/** The three large products in the showcase. */
export const showcase = [
  {
    id: 'chicken-gyros-wrap',
    shout: 'The one everything else is measured against',
    name: 'Chicken Gyros Wrap',
    blurb:
      'Chicken gyros carved off the spit into warm pita with tomato, lettuce, fries and tzatziki.',
    kcal: '736 kcal (regular)',
    diet: null,
    burst: 'Off the spit',
    image: 'show-chicken-gyros',
    alt: 'Chicken gyros wrap in warm Greek pita, packed with fries, lettuce and tomato, held in branded paper.',
    tone: 'lemon',
  },
  {
    id: 'halloumi-wrap',
    shout: 'Squeaky, golden, seriously underrated',
    name: 'Halloumi Wrap',
    blurb:
      'Grilled halloumi in pita with tomato, onion, lettuce, fries and tzatziki.',
    kcal: '748 kcal (regular)',
    diet: 'Vegetarian',
    burst: 'Squeaky & golden',
    image: 'show-halloumi',
    alt: 'Grilled halloumi wrap in Greek pita with fries, salad and tzatziki on a light background.',
    tone: 'tomato',
  },
  {
    id: 'vegan-gyros-wrap',
    shout: 'Plant-based, and it still gets the fries',
    name: 'Vegan Gyros Wrap',
    blurb:
      'Meatless gyros in pita with tomato, onion, lettuce, fries and hummus.',
    kcal: '785 kcal (regular)',
    diet: 'Vegan',
    burst: 'Fully plant-based',
    image: 'show-vegan-gyros',
    alt: 'Vegan gyros wrap in Greek pita filled with fries, lettuce, tomato and hummus.',
    tone: 'blue',
  },
];

/** The standout full-width feature. */
export const feature = {
  id: 'chicken-gyros-box',
  name: 'Chicken Gyros Box',
  blurb:
    'Chicken gyros served with pita, salad, fries and tzatziki — laid out in the box rather than rolled up. The one to get when you want to see everything you ordered.',
  kcal: '909 kcal (regular)',
  image: 'feature-gyros-box',
  alt: 'Chicken gyros box with carved chicken, golden fries, Greek salad and a pot of tzatziki in a branded tray.',
};

/** Short menu-range list used under the showcase — all real menu sections. */
export const ranges = [
  'Greek pita wraps',
  'Box menu',
  'Bowls',
  'Meal deals',
  'Tortilla wraps',
  'Kids’ meals',
];
