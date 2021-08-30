import {Router} from "express";
import auth from "./auth";
import users from "./users";
import setSkills from "./setSkills";
import itemNames from "./itemNames";
import recipeByName from "./recipeByName";
import category from "./category";

const router = Router();

router.post("/auth", auth)
router.get("/category", category)
router.get("/itemNames", itemNames)
router.get("/recipeByName", recipeByName)
router.post("/setSkills", setSkills)
router.get("/users", users)

export default router