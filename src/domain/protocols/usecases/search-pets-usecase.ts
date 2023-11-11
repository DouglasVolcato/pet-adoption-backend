import {
  PetCategoryEnum,
  PetEntityType,
  PetStatusEnum,
} from "../entities/pet-entity-type";

export namespace SearchPetsUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = {
    limit: number;
    offset: number;
    term?: string;
    name?: string;
    description?: string;
    category?: PetCategoryEnum;
    status?: PetStatusEnum;
    createdAt?: string;
  };
  export type Output = Promise<PetEntityType[]>;
}
