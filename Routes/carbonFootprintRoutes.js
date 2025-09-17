import express from "express";
import { calculateFootprint } from "../controllers/carbonFootprintController.js";

const router = express.Router();

router.post("/calculate", calculateFootprint);

export default router;
