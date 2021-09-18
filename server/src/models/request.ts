import {IUser} from "./user";
import {Document, model, Schema} from "mongoose";
import ObjectID = Schema.Types;
import {CompletedRecipe} from "../types/crafting";

type ICraftingRequestBase = {
    recipe: CompletedRecipe,
    tradeskill: string,
    requester: IUser,
    assignedTo: IUser,
    materialsSubmitted: boolean
}

export type ICraftingRequest = ICraftingRequestBase & Document

const craftingRequestSchema = new Schema({
    recipe: Object,
    tradeskill: String,
    requester: {type: ObjectID, ref: "User"},
    assignedTo: {type: ObjectID, ref: "User"},
    materialsSubmitted: Boolean
})

const CraftingRequest = model<ICraftingRequest>("CraftingRequest", craftingRequestSchema)

export default CraftingRequest