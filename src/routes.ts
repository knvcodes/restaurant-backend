import express from "express";
import restaurantRouter from "modules/restaurants/restaurant.routes";

const router = express.Router();

router.use("/restaurants", restaurantRouter);

export default router;
