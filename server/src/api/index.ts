import {Router} from "express";
import auth from "./auth";
import craft from "./craft";
import users from "./users";
import setSkills from "./setSkills";

const router = Router();

router.post("/auth", auth)
router.post("/craft", craft)
router.post("/setSkills", setSkills)
router.get("/users", users)

export default router