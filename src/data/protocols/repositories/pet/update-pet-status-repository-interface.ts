import { PetEntityType, PetStatusEnum } from "../../../../domain/protocols";

export interface UpdatePetStatusRepositoryIntereface {
  updateStatus(
    petId: string,
    newStatus: PetStatusEnum
  ): Promise<PetEntityType | null>;
}
