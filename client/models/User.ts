import mongoose, { Document, models, Schema } from 'mongoose';

// Define the Mongoose schema for the User model
const UserSchema = new Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model if it's not already created
const UserModel = models.User || mongoose.model("User", UserSchema);
export default UserModel;
