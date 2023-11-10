import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  admin: Boolean,
});

export const UserMongoDbModel: Model<any> = mongoose.model("User", userSchema);
