import { InferSchemaType, model, Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number | undefined) => boolean;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createPasswordResetToken: () => string
}

const usersSchema = new Schema<IUser>({
  name: { type: String, required: true, unique:true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Please provide a valid email",
    },
  },
  role: {
    type: String,
    enum: ['user', 'loc-staff', 'admin'],
    default: 'user'
  },
  password: { 
    type: String, 
    required: [true, "Plesase provide a password"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confrim your password"],
    validate: {
      validator(this: IUser, el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    select: false
  },
  passwordChangedAt: {type: Date},
  passwordResetToken: {type: String},
  passwordResetExpires: {type: Date}
});

usersSchema.pre<IUser & Document>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre<IUser & Document>("save", async function (next) {
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

usersSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string) {
 return await bcrypt.compare(candidatePassword,userPassword);
};

usersSchema.methods.changedPasswordAfter = function(JWTTimestamp:number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(),10)
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

usersSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken, HashToken: this.passwordResetToken})
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
}

type Users = InferSchemaType<typeof usersSchema>;
export default model<Users>("Users", usersSchema);
