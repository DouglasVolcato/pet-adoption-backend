import { PetEntityType } from "../../../../domain/protocols";

export interface CreatePetsRepositoryIntereface {
  createPets(pets: PetEntityType[]): Promise<void>;
}
