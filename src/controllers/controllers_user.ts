import { RequestHandler } from "express";
import UserModel from "../models/users";
import { catchAsync } from "../util/catchAsync";
import mongoose from "mongoose";
import AppError from "../util/appError";

export const getAllUsers: RequestHandler = catchAsync(async (req, res, next) => {
    const allUsers = await UserModel.find()
    if(!allUsers) {
        return next(new AppError("No users in the database", 404));
    }
    res.status(200).json({
        status: "Success",
        data: {          
            allUsers
        }
    });
});

export const getMe: RequestHandler = async (req, res, next) => {
    req.params.userId = req.user?._id;
    next()
};

export const getOneUser: RequestHandler = catchAsync(async (req, res, next) => {
    const user_id = req.params.userId;
    if (!mongoose.isValidObjectId(user_id)) {
        return next(new AppError("your input id is not vaild", 404));
    }
    const user = await UserModel.findById(user_id).exec()
    if (!user) {
        return next(new AppError("there is no such user", 400))
    }
    res.status(200).json({
        status: "Success",
        data: {
            user
        }
    });
})

export const createUser: RequestHandler = catchAsync(async (req, res) => {
    const newUser = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    res.status(201).json({
        status: "Success",
        data: {
            newUser
        }
    });
})

export const deleteUser: RequestHandler = catchAsync(async (req,res,next) => {
     await UserModel.findByIdAndDelete(req.params.userId)

     res.status(200).json({
        status: "Success",
    })
  next()
})

