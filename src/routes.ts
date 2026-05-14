import express from "express";
import restaurantRouter from "modules/restaurants/restaurant.routes";
import dishesRouter from "modules/dishes/dishes.routes";
import supplementsRouter from "modules/supplements/supplements.routes";
import uploadRouter from "modules/upload/upload.routes";

const router = express.Router();

router.use("/restaurants", restaurantRouter);
router.use("/dishes", dishesRouter);
router.use("/supplements", supplementsRouter);

// upload section
router.use("/upload", uploadRouter);

export default router;
