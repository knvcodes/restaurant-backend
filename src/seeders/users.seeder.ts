// seeder/users.seeder.js

import Users from "../modules/users/users.model.js";

// Static user data
const STATIC_USERS = [
  // 1 Admin
  {
    name: "Admin User",
    email: "admin@restaurant.com",
    password: "Admin@123",
    role: "admin",
    isOAuth: false,
  },

  // Owners (5 users)
  {
    name: "John Smith",
    email: "john.smith@restaurant.com",
    password: "Owner@123",
    role: "owner",
    isOAuth: false,
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@restaurant.com",
    password: "Owner@123",
    role: "owner",
    isOAuth: false,
  },
  {
    name: "Michael Brown",
    email: "michael.brown@restaurant.com",
    password: "Owner@123",
    role: "owner",
    isOAuth: false,
  },
  {
    name: "Emily Davis",
    email: "emily.davis@restaurant.com",
    password: "Owner@123",
    role: "owner",
    isOAuth: false,
  },
  {
    name: "Robert Wilson",
    email: "robert.wilson@restaurant.com",
    password: "Owner@123",
    role: "owner",
    isOAuth: false,
  },

  // Customers (remaining)
  {
    name: "Alice Cooper",
    email: "alice@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Bob Martin",
    email: "bob@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Charlie Parker",
    email: "charlie@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Diana Prince",
    email: "diana@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Eve Johnson",
    email: "eve@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Frank Castle",
    email: "frank@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Grace Hopper",
    email: "grace@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Henry Ford",
    email: "henry@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Ivy League",
    email: "ivy@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Jack Ryan",
    email: "jack@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Kate Bishop",
    email: "kate@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Liam Neeson",
    email: "liam@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Mia Wallace",
    email: "mia@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Noah Ark",
    email: "noah@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Olivia Pope",
    email: "olivia@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Peter Parker",
    email: "peter@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
  {
    name: "Quinn Fabray",
    email: "quinn@email.com",
    password: "Customer@123",
    role: "customer",
    isOAuth: false,
  },
];

// ── Seeder ──────────────────────────────────────────────

export async function seedUsers() {
  try {
    await Users.deleteMany({});
    console.log("🗑️  Cleared existing users");

    for (const userData of STATIC_USERS) {
      await Users.create(userData);
    }

    console.log(`✅ Seeded ${STATIC_USERS.length} users`);
    console.log(`   - 1 admin`);
    console.log(`   - 5 owners`);
    console.log(`   - ${STATIC_USERS.length - 6} customers`);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    throw error;
  }
}
