import express from "express";
import { calculateFootprint, getFootprintHistory } from "../controllers/carbonFootprintController.js";

const router = express.Router();

router.post("/calculate", calculateFootprint);
router.get("/history", getFootprintHistory);

export default router;
