import {Router} from "express";
import auth from "./auth";
import craft from "./craft";
import users from "./users";
import setSkills from "./setSkills";
import craftingRequests from "./craftingRequests";
import complete from "./complete";

const router = Router();

router.post("/auth", auth)
router.post("/complete", complete)
router.post("/craft", craft)
router.get("/craftingRequests", craftingRequests)
router.post("/setSkills", setSkills)
router.get("/users", users)

export default router