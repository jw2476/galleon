import {Request, Response} from "express";
import {getCraftingData} from "../types/crafting";

const {recipes, categories} = getCraftingData()

export default async (req: Request, res: Response) => {

}