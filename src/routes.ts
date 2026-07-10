import express from "express";
import restaurantRouter from "./modules/restaurants/restaurant.routes.js";
import dishesRouter from "./modules/dishes/dishes.routes.js";
import supplementsRouter from "./modules/supplements/supplements.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import uploadRouter from "./modules/upload/upload.routes.js";
import usersRouter from "./modules/users/users.routes.js";

const router = express.Router();

router.use("/restaurants", restaurantRouter);
router.use("/dishes", dishesRouter);
router.use("/supplements", supplementsRouter);

// owner auth
router.use("/auth", authRouter);

// user
router.use("/user", usersRouter);

// upload section
router.use("/upload", uploadRouter);

export default router;
