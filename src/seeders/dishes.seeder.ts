// ── Sample Data ────────────────────────────────────────

import { Types } from "mongoose";
import Dishes from "../modules/dishes/dishes.model.js";
import Restaurants from "../modules/restaurants/restaurant.model.js";
import Supplements from "../modules/supplements/supplements.model.js";

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
  "Chicken Biryani",
  "Vegetable Biryani",
  "Chicken Fried Rice",
  "Egg Fried Rice",
  "Kung Pao Chicken",
  "Sweet and Sour Chicken",
  "Chicken Tikka",
  "Lamb Kebab",
  "Grilled Salmon",
  "BBQ Ribs",
  "Pulled Pork Sandwich",
  "Club Sandwich",
  "Chicken Quesadilla",
  "Beef Stroganoff",
  "Shrimp Scampi",
  "Seafood Paella",
  "Ramen Bowl",
  "Pesto Pasta",
  "Chicken Parmesan",
  "Mango Sticky Rice",
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
  "Perfectly seasoned and cooked to order every time.",
  "A customer favorite with unforgettable taste.",
  "Bursting with vibrant flavors and fresh herbs.",
  "Prepared using traditional family recipes.",
  "A satisfying meal crafted for every craving.",
  "Simple ingredients transformed into something extraordinary.",
  "Freshly made with premium quality ingredients.",
  "A delicious balance of texture and flavor.",
  "Golden, crispy, and served piping hot.",
  "Made fresh from scratch every single day.",
  "A wholesome choice packed with natural goodness.",
  "Carefully marinated for maximum flavor.",
  "Tender, juicy, and seasoned to perfection.",
  "An irresistible combination of sweet and savory.",
  "Inspired by authentic regional cuisine.",
  "Cooked over high heat for a smoky finish.",
  "Loaded with rich flavors in every bite.",
  "A refreshing dish that's both light and satisfying.",
  "Perfect for lunch, dinner, or anytime cravings.",
  "Made with aromatic spices and fresh vegetables.",
  "A bold and flavorful experience from start to finish.",
  "Balanced with just the right amount of seasoning.",
  "Fresh ingredients make every serving exceptional.",
  "A comforting classic with homemade goodness.",
  "Prepared with passion and attention to detail.",
  "Every bite delivers a delicious burst of flavor.",
  "Expertly crafted for the perfect taste and texture.",
  "A rich recipe inspired by traditional cooking.",
  "Freshly grilled and finished with signature spices.",
  "A hearty meal that never disappoints.",
  "Perfectly portioned for a satisfying dining experience.",
  "Combining premium ingredients with authentic recipes.",
  "A flavorful creation designed to delight every palate.",
  "Cooked fresh when you order for maximum quality.",
  "Packed with savory goodness and irresistible aroma.",
  "An all-time favorite that keeps guests coming back.",
  "A delicious blend of tradition and innovation.",
  "Made with handpicked ingredients for superior taste.",
  "Fresh, wholesome, and full of natural flavors.",
  "A memorable dish that's worth coming back for.",
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
  "popular",
  "healthy",
  "organic",
  "seasonal",
  "family-favorite",
  "kids-choice",
  "premium",
  "budget-friendly",
  "quick-bite",
  "street-food",
  "traditional",
  "fusion",
  "grilled",
  "fried",
  "baked",
  "steamed",
  "roasted",
  "smoked",
  "sweet",
  "savory",
  "tangy",
  "crispy",
  "creamy",
  "cheesy",
  "protein-rich",
  "fiber-rich",
  "heart-healthy",
  "low-fat",
  "sugar-free",
  "halal",
  "eggless",
  "seafood",
  "local-special",
  "limited-time",
  "staff-pick",
  "signature",
  "fresh",
  "must-try",
];

const servingTitles = ["Small", "Medium", "Large", "Family"];
const currencies = ["INR", "USD", "EUR"];

// ── Helpers ────────────────────────────────────────────

function pickRandom(arr: string | any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Builders ───────────────────────────────────────────

function buildServing(basePrice: number) {
  const servings = [];
  const count = getRandomInt(1, 4);

  for (let i = 0; i < count; i++) {
    servings.push({
      id: crypto.randomUUID(),
      type: servingTitles[i],
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

function buildSupplements(supplementIds: any) {
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
    const supplementsByRestaurant: Record<string, Types.ObjectId[]> = {};
    for (const s of supplements) {
      const key = String(s.restaurantId);
      if (!supplementsByRestaurant[key]) supplementsByRestaurant[key] = [];
      supplementsByRestaurant[key].push(s._id);
    }

    // 3. Clear existing dishes
    await Dishes.deleteMany({});
    console.log("🗑️  Cleared existing dishes");

    // 4. Create dishes for each restaurant
    for (const restaurantId of restaurantIds) {
      // Determine how many dishes to create for this restaurant
      const dishesCount = getRandomInt(3, 8);
      const availableSupplements =
        supplementsByRestaurant[String(restaurantId)] || [];

      console.log(
        `🍽️  Creating ${dishesCount} dishes for restaurant ${restaurantId}`,
      );

      for (let i = 0; i < dishesCount; i++) {
        const basePrice = getRandomInt(50, 800);

        await Dishes.create({
          name: dishNames[(count + i) % dishNames.length],
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
    }
    console.log(`✅ Seeded ${count} dishes`);
  } catch (error) {
    console.error("❌ Dish seeder failed:", error);
    throw error;
  }
}
