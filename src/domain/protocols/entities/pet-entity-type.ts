export enum PetAdoptionStatus {
  FREE = "free",
  ADOPTED = "adopted",
}

export type PetEntityType = {
  name: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  status: PetAdoptionStatus;
};
