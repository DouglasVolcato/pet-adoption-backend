import { PetEntityType } from "../../../domain/protocols";

export interface PetSearcherInterface {
  searchPets(): Promise<PetEntityType[]>;
}
