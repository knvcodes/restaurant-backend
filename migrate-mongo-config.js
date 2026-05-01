import "dotenv/config";

export default {
  mongodb: {
    url: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
    databaseName: process.env.DB_NAME,
    options: {},
  },

  migrationsDir: "migrations",

  changelogCollectionName: "migrations",

  migrationFileExtension: ".js",
  moduleSystem: "esm",
};
