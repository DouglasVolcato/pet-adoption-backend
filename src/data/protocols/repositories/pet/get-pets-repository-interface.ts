import {
  PetCategoryEnum,
  PetEntityType,
  PetStatusEnum,
} from "../../../../domain/protocols";

export type PetSearchParamsType = {
  limit: number;
  offset: number;
  term?: string;
  name?: string;
  description?: string;
  category?: PetCategoryEnum;
  status?: PetStatusEnum;
  createdAt?: string;
};

export interface GetPetsRepositoryInterface {
  getPets(searchParams: PetSearchParamsType): Promise<PetEntityType[]>;
}
