import {Router} from "express";
import auth from "./auth";
import users from "./users";
import setSkills from "./setSkills";
import itemNames from "./itemNames";
import recipeByName from "./recipeByName";
import submitRequest from "./submitRequest";
import availableRequests from "./availableRequests";
import assignedRequests from "./assignedRequests";
import assignToRequest from "./assignToRequest";
import me from "./me";
import yourRequests from "./yourRequests";
import submitGatheringMaterials from "./submitGatheringMaterials";
import complete from "./complete";
import requests from "./requests";
import login from "./login";
import cancel from "./cancel";

const router = Router();

router.post("/assignToRequest", assignToRequest)
router.post("/auth", auth)
router.post("/cancel", cancel)
router.post("/complete", complete)
router.get("/itemNames", itemNames)
router.post("/login", login)
router.get("/me", me)
router.get("/assignedRequests", assignedRequests)
router.get("/recipeByName", recipeByName)
router.get("/requests", requests)
router.get("/availableRequests", availableRequests)
router.post("/setSkills", setSkills)
router.post("/submitGatheringMaterials", submitGatheringMaterials)
router.post("/submitRequest", submitRequest)
router.get("/users", users)
router.get("/yourRequests", yourRequests)

export default router