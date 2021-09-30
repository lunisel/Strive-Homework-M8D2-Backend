import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "User",
    },
    refreshToken: {type: String}
  },
  { timestamps: true }
);

async function hashPassword(next) {
  const newUser = this;
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 10);
  }
  next();
}

UserSchema.pre("save", hashPassword);

UserSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  const { password: plainPwd } = update

  if (plainPwd) {
    const password = await bcrypt.hash(plainPwd, 10)
    this.setUpdate({ ...update, password })
  }
});

UserSchema.methods.toJSON = function () {
  const userDocument = this;

  const userObject = userDocument.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password);

    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};

export default model("User", UserSchema);
