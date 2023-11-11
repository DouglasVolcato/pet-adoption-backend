import { PetEntityType, PetStatusEnum } from "../entities/pet-entity-type";

export namespace ChangePetStatusUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = {
    petId: string;
    newStatus: PetStatusEnum;
  };
  export type Output = Promise<PetEntityType | Error>;
}
