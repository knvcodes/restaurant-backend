import express from "express";
import restaurantRouter from "modules/restaurants/restaurant.routes";
import dishesRouter from "modules/dishes/dishes.routes";
import supplementsRouter from "modules/supplements/supplements.routes";
import uploadRouter from "modules/upload/upload.routes";
import authRouter from "modules/auth/auth.routes";

const router = express.Router();

router.use("/restaurants", restaurantRouter);
router.use("/dishes", dishesRouter);
router.use("/supplements", supplementsRouter);

// owner auth
router.use("/auth", authRouter);

// upload section
router.use("/upload", uploadRouter);

export default router;
