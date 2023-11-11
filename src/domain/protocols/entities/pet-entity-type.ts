export enum PetAdoptionEnum {
  FREE = "free",
  ADOPTED = "adopted",
}

export enum PetCategoryEnum {
  FREE = "free",
  ADOPTED = "adopted",
}

export type PetEntityType = {
  id: string;
  name: string;
  image: string;
  category: string;
  createdAt: string;
  description: PetCategoryEnum;
  status: PetAdoptionEnum;
};
