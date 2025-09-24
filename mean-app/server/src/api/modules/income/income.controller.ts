import { Request, Response } from 'express';
import { addIncome } from './income.service';

export const createIncome = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;  // <- Correct way
    //const userId="68cbdd76325a0b6ac813c763";
    const result = await addIncome(req.body, userId);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
