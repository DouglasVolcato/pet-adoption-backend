export enum PetAdoptionEnum {
  FREE = "free",
  ADOPTED = "adopted",
}

export enum PetCategoryEnum {
  CATS = "cats",
  DOGS = "dogs",
}

export type PetEntityType = {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  category: PetCategoryEnum;
  status: PetAdoptionEnum;
};
