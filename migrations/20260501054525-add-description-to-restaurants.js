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

function getRandomDescription() {
  const index = Math.floor(Math.random() * restaurantDescriptions.length);
  return restaurantDescriptions[index];
}

const currencies = ["INR", "USD", "EUR"];

function getRandomCurrency() {
  return currencies[Math.floor(Math.random() * currencies.length)];
}

function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildMoney(min = 20, max = 500) {
  return {
    amount: getRandomAmount(min, max),
    currency: getRandomCurrency(),
  };
}

function getRandomHour(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildDeliveryHours() {
  const startHour = getRandomHour(8, 12); // opens between 8AM–12PM
  const endHour = getRandomHour(18, 23); // closes between 6PM–11PM

  const from = new Date();
  from.setHours(startHour, 0, 0, 0);

  const to = new Date();
  to.setHours(endHour, 0, 0, 0);

  return { from, to };
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildOpenDays() {
  const startIndex = Math.floor(Math.random() * 3); // early week
  const endIndex = Math.floor(Math.random() * 4) + 3; // later week

  return {
    from: days[startIndex],
    to: days[endIndex],
  };
}

export default {
  async up(db, client) {
    // TODO write your migration here.

    const restaurants = await db.collection("restaurants").find({}).toArray();

    const bulkOps = restaurants.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            description: getRandomDescription(),
            deliveryFee: buildMoney(),
            cancellationFee: buildMoney(),
            minimumDelivery: buildMoney(),
            openDays: buildOpenDays(),
            deliveryHours: buildDeliveryHours(),
          },
        },
      },
    }));

    await db.collection("restaurants").bulkWrite(bulkOps);
  },

  async down(db, client) {},
};
