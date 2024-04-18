import { RequestHandler } from "express";
import DebugStatsModel from "../models/debugStats";
import { catchAsync } from "../util/catchAsync";
import AppError from "../util/appError";
import APIFeatures from "../util/APIFeature";

export const getDebugStats: RequestHandler = catchAsync(
  async (req, res, next) => {
    const debugStats = new APIFeatures(DebugStatsModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const records = await debugStats.query;

    if (records.length === 0) {
      next(new AppError("There is no projects in the database", 404));
    }

    res.status(200).json({
      status: "Success",
      records,
    });
  }
);

export const getUniqueProject: RequestHandler = catchAsync(
  async (req, res, next) => {
    const uniqueProject = await DebugStatsModel.distinct("project");
    if (uniqueProject.length === 0) {
      next(new AppError("There is no project int the database", 404));
    }
    res.status(200).json({
      status: "Success",
      number: uniqueProject.length,
      uniqueProject,
    });
  }
);

export const currentProjectAverage: RequestHandler = catchAsync(
  async (req, res, next) => {
    const currentProjectAverage = req.query.project;
    const result = await DebugStatsModel.aggregate([
      { $match: { project: currentProjectAverage, project_status: false } },
      {
        $group: {
          _id: null,
          totalRealLabel: { $sum: "$real_label" },
          totalPeopleNum: { $sum: "$people_num" },
        },
      },
      {
        $project: {
          average: { $divide: ["$totalRealLabel", "$totalPeopleNum"] },
        },
      },
    ]);

    if (!result.length) {
      return next(new AppError("No documents found with that project", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        currentAverage: result[0].average,
      },
    });
  }
);

export const ptwshComprehensiveAverage: RequestHandler = catchAsync(
  async (req, res, next) => {
    const result = await DebugStatsModel.aggregate([
      { $match: { office: "PTWSH", project_status: false } },
      {
        $group: {
          _id: null,
          totalRealLabel: { $sum: "$real_label" },
          totalPeopleNum: { $sum: "$people_num" },
        },
      },
      {
        $project: {
          average: { $divide: ["$totalRealLabel", "$totalPeopleNum"] },
        },
      },
    ]);

    if (!result.length) {
      return next(new AppError("No documents found with that office", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        average: result[0].average,
      },
    });
  }
);

export const iQueComprehensiveAverage: RequestHandler = catchAsync(
  async (req, res, next) => {
    const result = await DebugStatsModel.aggregate([
      { $match: { office: "iQue", project_status: false } },
      {
        $group: {
          _id: null,
          totalRealLabel: { $sum: "$real_label" },
          totalPeopleNum: { $sum: "$people_num" },
        },
      },
      {
        $project: {
          average: { $divide: ["$totalRealLabel", "$totalPeopleNum"] },
        },
      },
    ]);

    if (!result.length) {
      return next(new AppError("No documents found with that office", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        average: result[0].average,
      },
    });
  }
);
