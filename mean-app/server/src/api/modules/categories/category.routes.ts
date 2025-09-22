import { Router } from "express";
import * as categoryController from "./category.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", auth, categoryController.getCategories);
router.post("/", auth, categoryController.createCategory);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

export default router;
