import express from "express";
import restaurantRouter from "modules/restaurants/restaurant.routes";
import uploadRouter from "modules/upload/upload.routes";

const router = express.Router();

router.use("/restaurants", restaurantRouter);
router.use("/upload", uploadRouter);

export default router;
