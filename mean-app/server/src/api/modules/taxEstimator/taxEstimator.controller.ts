import { Request, Response } from "express";
import * as taxService from "./taxEstimator.service";
import { AuthRequest } from "../../middlewares/auth";

export const createTaxEstimate = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const estimate = await taxService.createEstimate({
        ...req.body,
        user_id: req.user.id, // take from token, not body
      });
  
      res.status(201).json(estimate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

export const getTaxEstimates = async (_req: Request, res: Response) => {
  try {
    const estimates = await taxService.getEstimates();
    res.json(estimates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaxEstimateById = async (req: Request, res: Response) => {
  try {
    const estimate = await taxService.getEstimateById(req.params.id);
    if (!estimate) return res.status(404).json({ message: "Not found" });
    res.json(estimate);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
