import type {IUserBase} from "./user";
import type {Recipe} from "./crafting";

export type ICraftingRequestBase = {
    recipe: Recipe,
    tradeskill: string,
    requester: IUserBase,
    assignedTo: IUserBase
}