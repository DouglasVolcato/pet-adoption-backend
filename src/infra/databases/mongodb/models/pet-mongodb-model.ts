import mongoose, { Model } from "mongoose";

const PetSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  image: String,
  createdAt: String,
  category: String,
  status: String,
});

export const PetMongoDbModel: Model<any> = mongoose.model("Pet", PetSchema);
