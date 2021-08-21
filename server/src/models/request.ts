import {IUser} from "./user";
import {Document, model, Schema} from "mongoose";
import ObjectID = Schema.Types;

type ICraftingRequestBase = {
    item: string,
    perk: string,
    notes: string,
    attempts: number,
    madeBy: IUser,
    assignedTo: IUser
}

export type ICraftingRequest = ICraftingRequestBase & Document

const craftingRequestSchema = new Schema({
    item: String,
    perk: String,
    notes: String,
    attempts: Number,
    madeBy: {type: ObjectID, ref: "User"},
    assignedTo: {type: ObjectID, ref: "User"}
})

const CraftingRequest = model<ICraftingRequest>("CraftingRequest", craftingRequestSchema)

export default CraftingRequest