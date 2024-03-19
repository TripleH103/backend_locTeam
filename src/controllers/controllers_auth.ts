import { NextFunction, RequestHandler, Request, Response } from "express";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import AppError from "../util/appError";
import UsersModel from "../models/users";
import { catchAsync } from "../util/catchAsync";
import crypto from "crypto";

const signToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

const createSendToken = (user:Document, statusCode:number, res:Response) => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions)
  res.status(statusCode).json({
    status: "Success",
    token,
    user
  });
}

export const signup: RequestHandler = catchAsync(async (req, res) => {
  const newUser = await UsersModel.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, res);
});

export const signin: RequestHandler = catchAsync(
  async (req, res, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await UsersModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Incorrect email or password", 401));
    }
    const correctPassword:boolean = await user.correctPassword(password, user.password);
    if (!correctPassword) {
      return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, res);
  }
);

interface IDecodedToken {
  id: string;
  iat: number;
}

export const protect: RequestHandler = catchAsync(
  async (req: Request, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    // 2) Verification token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IDecodedToken;

    // 3) Check the user exists or not
    const currentUser = await UsersModel.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError(
          "The User belonging to this token does no longer exist",
          401
        )
      );

    // 4) Check if the user changed password after token is issued
    if (currentUser?.changedPasswordAfter(decoded.iat))
      return next(new AppError("You have recently changed the password, Please signin again", 401));

    req.user = currentUser;
    console.log ({name: req.user.name, email: req.user.email})
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req:Request, res: unknown, next: NextFunction) => {
    const user = req.user
    if (!user || !roles.includes(user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const forgotPassword: RequestHandler = catchAsync(
  async (req, res, next) => {
    const user = await UsersModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no such user with that Email", 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}}`

    res.status(200).json({
      statuse: "Success",
      token: `Your resetToken is: ${resetToken} just use the following URL to Reset your password`,
      url: `${resetURL}`
    })
  }
);

export const resetPassword: RequestHandler = catchAsync(async(req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await UsersModel.findOne({ passwordResetToken : hashedToken, passwordResetExpires: {$gt: Date.now()} });

  if (!user) {
    return next(new AppError("You offered an invaild token", 404));
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save();
  
  createSendToken(user, 200, res)
});


export const updatePassword: RequestHandler = catchAsync(async (req:Request, res, next) => {
 
  const user = await UsersModel.findById(req.user?._id).select("+password")
  if (!user) {
    return next(new AppError("The User is not Found", 404));
  }
  console.log(user)
 
  const verificationPassword:boolean = await user.correctPassword(req.body.currentPassword, user.password);
  if(!verificationPassword) {
    return next(new AppError("Your current password is not correct", 401))
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save()

  createSendToken(user, 200, res);
});