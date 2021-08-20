import {IUser} from "./user";
import {Document, model, Schema} from "mongoose";
import ObjectID = Schema.Types;

type ICraftingRequestBase = {
    item: string,
    primary: string,
    secondary: string,
    notes: string,
    madeBy: IUser,
    assignedTo: IUser
}

type ICraftingRequest= ICraftingRequestBase & Document

const craftingRequestSchema = new Schema({
    item: String,
    primary: String,
    secondary: String,
    notes: String,
    madeBy: {type: ObjectID, ref: "User"},
    assignedTo: {type: ObjectID, ref: "User"}
})

const CraftingRequest = model<ICraftingRequest>("CraftingRequest", craftingRequestSchema)

export default CraftingRequest