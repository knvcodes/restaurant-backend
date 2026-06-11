import Dishes from "../src/modules/dishes/dishes.model.ts";
import Restaurants from "../src/modules/restaurants/restaurant.model.ts";
import Supplements from "../src/modules/supplements/supplements.model.ts";

// ── Sample Data ────────────────────────────────────────

const dishNames = [
  "Margherita Pizza",
  "Pepperoni Pizza",
  "Classic Cheeseburger",
  "Veggie Burger",
  "Spaghetti Carbonara",
  "Chicken Alfredo",
  "Caesar Salad",
  "Greek Salad",
  "Butter Chicken",
  "Paneer Tikka Masala",
  "Sushi Roll Combo",
  "Pad Thai",
  "Beef Tacos",
  "Veggie Burrito",
  "Tom Yum Soup",
  "Pho Noodle Bowl",
  "Mushroom Risotto",
  "Lasagna Bolognese",
  "Fish and Chips",
  "Chocolate Lava Cake",
  "Tiramisu",
  "Apple Pie",
  "Garlic Bread",
  "Bruschetta",
  "French Fries",
  "Onion Rings",
  "Buffalo Wings",
  "Hummus Platter",
  "Falafel Wrap",
  "Shawarma Plate",
];

const dishDescriptions = [
  "A classic favorite made with fresh ingredients and authentic spices.",
  "Handcrafted daily with care, perfect for sharing or a hearty meal.",
  "Our signature dish, loved by regulars and first-timers alike.",
  "Light, flavorful, and ideal for a quick bite or full meal.",
  "Slow-cooked to perfection with a blend of traditional seasonings.",
  "Crispy, savory, and absolutely satisfying.",
  "A modern twist on a timeless recipe.",
  "Comfort food that hits the spot every single time.",
  "Freshly prepared with locally sourced produce.",
  "Rich, creamy, and packed with bold flavors.",
];

const tagPool = [
  "vegetarian",
  "vegan",
  "spicy",
  "gluten-free",
  "dairy-free",
  "non-veg",
  "chef-special",
  "bestseller",
  "new",
  "low-carb",
  "high-protein",
  "comfort-food",
];

const servingTitles = ["Small", "Medium", "Large", "Family"];
const currencies = ["INR", "USD", "EUR"];

// ── Helpers ────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Builders ───────────────────────────────────────────

function buildServing(basePrice) {
  const servings = [];
  const count = getRandomInt(1, 4);

  for (let i = 0; i < count; i++) {
    servings.push({
      title: servingTitles[i],
      value: i + 1,
      price: parseFloat((basePrice * (1 + i * 0.5)).toFixed(2)),
      currency: pickRandom(currencies),
    });
  }
  return servings;
}

function buildTags() {
  const tags = [];
  const count = getRandomInt(1, 4);
  const shuffled = [...tagPool].sort(() => 0.5 - Math.random());

  for (let i = 0; i < count; i++) {
    tags.push(shuffled[i]);
  }
  return tags;
}

function buildSupplements(supplementIds) {
  const supplements = [];
  const count = getRandomInt(0, 3);

  for (let i = 0; i < count; i++) {
    supplements.push(pickRandom(supplementIds));
  }
  return supplements;
}

// ── Seeder ─────────────────────────────────────────────

export async function seedDishes(count = 30) {
  try {
    // 1. Fetch existing restaurants (dishes require a valid restaurantId)
    const restaurants = await Restaurants.find().select("_id").lean();
    if (restaurants.length === 0) {
      throw new Error(
        "❌ No restaurants found. Please run the restaurant seeder first.",
      );
    }
    const restaurantIds = restaurants.map((r) => r._id);

    // 2. Fetch all supplements, grouped by their restaurantId
    const supplements = await Supplements.find()
      .select("_id restaurantId")
      .lean();
    const supplementsByRestaurant = {};
    for (const s of supplements) {
      const key = String(s.restaurantId);
      if (!supplementsByRestaurant[key]) supplementsByRestaurant[key] = [];
      supplementsByRestaurant[key].push(s._id);
    }

    // 3. Clear existing dishes
    await Dishes.deleteMany({});
    console.log("🗑️  Cleared existing dishes");

    // 4. Create new dishes
    for (let i = 0; i < count; i++) {
      const restaurantId = pickRandom(restaurantIds);
      const basePrice = getRandomInt(50, 800);
      const availableSupplements =
        supplementsByRestaurant[String(restaurantId)] || [];

      await Dishes.create({
        name: dishNames[i % dishNames.length],
        description: pickRandom(dishDescriptions),
        isActive: Math.random() > 0.1,
        tags: buildTags(),
        metadata: {
          calories: getRandomInt(150, 1200),
          prepTimeMinutes: getRandomInt(5, 45),
          spicyLevel: getRandomInt(0, 5),
        },
        supplements: buildSupplements(availableSupplements),
        serving: buildServing(basePrice),
        restaurantId,
      });
    }

    console.log(`✅ Seeded ${count} dishes`);
  } catch (error) {
    console.error("❌ Dish seeder failed:", error);
    throw error;
  }
}
