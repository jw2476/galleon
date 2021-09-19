import {Request, Response} from "express";
import CraftingRequest from "../models/request";

export default async (req: Request, res: Response) => {
    res.json(await CraftingRequest.find({}).populate("assignedTo"))
}