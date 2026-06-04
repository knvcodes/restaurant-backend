import mongoose from "mongoose";
import Restaurants from "../src/modules/restaurants/restaurant.model.ts";

// ── Helpers ─────────────────────────────────────────────

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
  "Morris Park Ave",
  "Northern Boulevard",
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
];

const currencies = ["INR", "USD", "EUR"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
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

export async function seedRestaurants(count = 20) {
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
      });
    }

    console.log(`✅ Seeded ${count} restaurants`);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    throw error;
  }
}
