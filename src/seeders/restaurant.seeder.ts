// ── Helpers ─────────────────────────────────────────────

import Restaurants from "../modules/restaurants/restaurant.model.js";
const restaurantNames = [
  "Morris Park Bake Shop",
  "The Corner Bistro",
  "Spice Symphony",
  "Blue Hill",
  "Le Bernardin",
  "Shake Shack",
  "Joe's Pizza",
  "Katz's Delicatessen",
  "Peter Luger",
  "Di Fara Pizza",
  "Xi'an Famous Foods",
  "Momofuku Noodle Bar",
  "The Halal Guys",
  "Tacos El Bronco",
  "Roberta's",
  "Gramercy Tavern",
  "Eleven Madison Park",
  "Sushi Nakazawa",
  "Mission Chinese",
  "The Smith",
  "Lilia",
  "L'Artusi",
  "Carbone",
  "Don Antonio",
  "Estela",
  "Wildair",
  "Contra",
  "Frenchette",
  "Via Carota",
  "I Sodi",
  "Casa Mono",
  "Barbuto",
  "Minetta Tavern",
  "Balthazar",
  "Pastis",
  "Le Coucou",
  "The Four Horsemen",
  "Semilla",
  "Claro",
  "Oxomoco",
  "Cosme",
  "Atla",
  "Tacombi",
  "Los Tacos No. 1",
  "Tortilleria Nixtamal",
  "Di An Di",
  "Saigon Shack",
  "Banh Mi Zon",
  "Pho Grand",
  "Thai Diner",
];

const boroughs = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
const cuisines = [
  "American",
  "Chinese",
  "Italian",
  "Mexican",
  "Indian",
  "Japanese",
  "Pizza",
  "Bakery",
  "French",
  "Middle Eastern",
  "Thai",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Mediterranean",
  "Ethiopian",
  "Brazilian",
  "Peruvian",
  "Argentine",
  "Caribbean",
  "Soul Food",
  "Seafood",
  "BBQ",
  "Steakhouse",
  "Diner",
  "Deli",
  "Tex-Mex",
  "Cajun",
  "Southern",
  "German",
  "Polish",
  "Russian",
  "Turkish",
  "Moroccan",
  "Lebanese",
  "Filipino",
  "Malaysian",
  "Indonesian",
  "Singaporean",
  "Burmese",
  "Nepalese",
  "Sri Lankan",
  "Pakistani",
  "Afghan",
  "Iranian",
  "Israeli",
  "Egyptian",
  "Nigerian",
  "Jamaican",
];

const streets = [
  "Flatbush Avenue",
  "Broadway",
  "Lexington Avenue",
  "Bedford Avenue",
  "Queens Boulevard",
  "Grand Concourse",
  "Arthur Kill Road",
  "2nd Avenue",
  "Bowery",
  "Houston Street",
  "Atlantic Avenue",
  "Jamaica Avenue",
  "Morris Park Avenue",
  "Northern Boulevard",
  "5th Avenue",
  "Madison Avenue",
  "Park Avenue",
  "Canal Street",
  "Delancey Street",
  "Wall Street",
  "Fulton Street",
  "Church Avenue",
  "Coney Island Avenue",
  "Ocean Parkway",
  "Eastern Parkway",
  "Kings Highway",
  "Nostrand Avenue",
  "Utica Avenue",
  "Flatlands Avenue",
  "Rockaway Boulevard",
  "Myrtle Avenue",
  "Jerome Avenue",
  "Fordham Road",
  "Gun Hill Road",
  "Tremont Avenue",
  "Southern Boulevard",
  "White Plains Road",
  "Pelham Parkway",
  "Cross Bay Boulevard",
  "Roosevelt Avenue",
  "Steinway Street",
  "Astoria Boulevard",
  "Francis Lewis Boulevard",
  "Merrick Boulevard",
  "Hillside Avenue",
  "Liberty Avenue",
  "Sunrise Highway",
  "Victory Boulevard",
  "Richmond Avenue",
  "Forest Avenue",
];

const restaurantDescriptions = [
  "Cozy spot serving authentic local cuisine with a modern twist.",
  "Family-friendly restaurant known for generous portions and warm service.",
  "Upscale dining experience with a focus on seasonal ingredients.",
  "Quick-service eatery perfect for casual meals and takeout.",
  "Hidden gem offering rich flavors and traditional recipes.",
  "Vibrant atmosphere with a diverse international menu.",
  "Minimalist cafe specializing in fresh, healthy dishes.",
  "Classic diner serving comfort food favorites all day.",
  "Trendy restaurant popular for fusion cuisine and creative plating.",
  "Relaxed dining space with a focus on grilled specialties.",
  "Neighborhood favorite known for consistency and quality.",
  "Elegant venue ideal for date nights and special occasions.",
  "Street-style food experience with bold and spicy flavors.",
  "Vegetarian-friendly menu with innovative plant-based dishes.",
  "Seafood-focused restaurant with fresh daily catches.",
  "Compact but lively space with fast and friendly service.",
  "Artisanal kitchen offering handcrafted meals and desserts.",
  "Casual hangout spot with a mix of local and global dishes.",
  "Rustic ambiance paired with hearty, home-style cooking.",
  "Modern bistro delivering a balance of taste and presentation.",
  "Late-night spot famous for its signature comfort dishes and craft cocktails.",
  "Intimate counter-service joint with made-from-scratch recipes daily.",
  "Bustling market-style eatery with rotating seasonal specials.",
  "Sleek rooftop venue with panoramic views and small plates.",
  "Old-school tavern with a curated beer list and hearty pub fare.",
  "Hole-in-the-wall treasure with legendary house-made sauces.",
  "Farm-to-table concept highlighting regional growers and producers.",
  "Bright, airy space with a pastry-forward brunch menu.",
  "No-frills spot where regulars swear by the daily specials board.",
  "Chef-driven tasting menu in an intimate, reservation-only setting.",
  "Colorful cantina-style space with live music on weekends.",
  "Noodle bar with an open kitchen and steaming bowls of comfort.",
  "Converted warehouse with industrial decor and wood-fired cooking.",
  "Beachside shack serving the freshest catch with ocean views.",
  "Food hall stall turned cult favorite with long but worthwhile lines.",
  "Grandmother's kitchen vibes with recipes passed down for generations.",
  "Sake bar meets izakaya with yakitori grilled over charcoal.",
  "Plant-filled greenhouse cafe with organic, locally sourced plates.",
  "Speakeasy-style entrance leading to a dimly lit, moody dining room.",
  "All-you-can-eat buffet with live cooking stations and global stations.",
  "Corner bakery-cafe with laminated pastries and single-origin coffee.",
  "Pop-up turned permanent with an ever-changing experimental menu.",
  "Sports bar hybrid with elevated game-day eats and local brews.",
  "Underground supper club with communal tables and surprise courses.",
  "Pet-friendly patio spot with dog menus and frozen treats.",
  "Retro-themed diner with neon signs and thick milkshake classics.",
  "Build-your-own bowl concept with endless topping combinations.",
  "Family-run trattoria with hand-rolled pasta and imported wines.",
  "Food truck brick-and-mortar with bold street food and loud flavors.",
  "Quiet reading-room cafe by day, wine bar with small plates by night.",
];

const currencies = ["INR", "USD", "EUR"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pickRandom(arr: string | any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddress() {
  return {
    building: String(getRandomInt(1, 9999)),
    coord: [
      parseFloat((-73.9 + Math.random() * 0.5).toFixed(6)),
      parseFloat((40.6 + Math.random() * 0.4).toFixed(6)),
    ],
    street: pickRandom(streets),
    zipcode: String(getRandomInt(10001, 11697)),
  };
}

function generateGrades() {
  const grades = [];
  const count = getRandomInt(1, 5);
  const gradeLetters = ["A", "B", "C", "P", "Z"];

  for (let i = 0; i < count; i++) {
    grades.push({
      date: new Date(
        Date.now() - getRandomInt(0, 365 * 2 * 24 * 60 * 60 * 1000),
      ),
      grade: pickRandom(gradeLetters),
      score: getRandomInt(0, 30),
    });
  }
  return grades;
}

function buildMoney(min = 20, max = 500) {
  return {
    amount: getRandomInt(min, max),
    currency: pickRandom(currencies),
  };
}

function buildDeliveryHours() {
  const startHour = getRandomInt(8, 12);
  const endHour = getRandomInt(18, 23);

  const from = new Date();
  from.setHours(startHour, 0, 0, 0);

  const to = new Date();
  to.setHours(endHour, 0, 0, 0);

  return { from, to };
}

function buildOpenDays() {
  const startIndex = getRandomInt(0, 3);
  const endIndex = getRandomInt(3, 6);
  return {
    from: days[startIndex],
    to: days[endIndex],
  };
}

// ── Seeder ──────────────────────────────────────────────

export async function seedRestaurants(count = 50) {
  try {
    await Restaurants.deleteMany({});
    console.log("🗑️  Cleared existing restaurants");

    for (let i = 0; i < count; i++) {
      await Restaurants.create({
        name: restaurantNames[i],
        borough: pickRandom(boroughs),
        cuisine: pickRandom(cuisines),
        address: generateAddress(),
        grades: generateGrades(),
        description: pickRandom(restaurantDescriptions),
        deliveryHours: buildDeliveryHours(),
        openDays: buildOpenDays(),
        deliveryFee: buildMoney(),
        cancellationFee: buildMoney(),
        minimumDelivery: buildMoney(),
        stats: {
          totalOrders: 0,
          totalViews: 0,
        },
      });
    }

    console.log(`✅ Seeded ${count} restaurants`);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    throw error;
  }
}
