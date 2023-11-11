import { PetEntityType } from "../../../../domain/protocols";
import { SearchPetsUseCase } from "../../../../domain/protocols/usecases/search-pets-usecase";

export type PetSearchParamsType = SearchPetsUseCase.Input;

export interface GetPetsRepositoryInterface {
  getPets(searchParams: PetSearchParamsType): Promise<PetEntityType[]>;
}
