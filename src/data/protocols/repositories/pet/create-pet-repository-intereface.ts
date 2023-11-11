import { PetEntityType } from "../../../../domain/protocols";

export interface CreatePetRepositoryIntereface {
  create(petEntity: PetEntityType): Promise<PetEntityType>;
}
