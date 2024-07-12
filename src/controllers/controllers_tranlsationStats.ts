import { RequestHandler } from "express";
import TranslationStatsModel from "../models/translationStats";
import { catchAsync } from "../util/catchAsync";
import AppError from "../util/appError";
import APIFeatures from "../util/APIFeature";
import translationStats from "../models/translationStats";

export const getTranslationStats: RequestHandler = catchAsync(
    async (req, res, next) => {
      const translationStats = new APIFeatures(TranslationStatsModel.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
      const records = await translationStats.query;
  
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
      const uniqueProject = await translationStats.distinct("project");
      if (uniqueProject.length === 0) {
        next(new AppError("There is no project in the database", 404));
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
      const selectedProject = req.query.project;
      const result = await TranslationStatsModel.aggregate([
        { $match: { project: selectedProject, project_status: false } },
        {
          $group: {
            _id: null,
            totalRealCharacters: { $sum: "$real_characters" },
            totalPeopleNum: { $sum: "$people_num" },
            office: { $first: "$office" },
          },
        },
        {
          $project: {
            average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
            office: 1,
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
          office: result[0].office,
        },
      });
    }
  );

  export const ptwshComprehensiveAverage: RequestHandler = catchAsync(
    async (req, res, next) => {
      const result = await TranslationStatsModel.aggregate([
        { $match: { office: "PTWSH", project_status: false } },
        {
          $group: {
            _id: null,
            totalRealCharacters: { $sum: "$real_characters" },
            totalPeopleNum: { $sum: "$people_num" },
          },
        },
        {
          $project: {
            average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
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
      const result = await TranslationStatsModel.aggregate([
        { $match: { office: "iQue", project_status: false } },
        {
          $group: {
            _id: null,
            totalRealCharacters: { $sum: "$real_characters" },
            totalPeopleNum: { $sum: "$people_num" },
          },
        },
        {
          $project: {
            average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
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
  
  export const dhsComprehensiveAverage: RequestHandler = catchAsync(
    async (req, res, next) => {
      const result = await TranslationStatsModel.aggregate([
        { $match: { office: "DHJ", project_status: false } },
        {
          $group: {
            _id: null,
            totalRealCharacters: { $sum: "$real_characters" },
            totalPeopleNum: { $sum: "$people_num" },
          },
        },
        {
          $project: {
            average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
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
  
  export const genresAverage: RequestHandler = catchAsync(
    async (req, res, next) => {
      const result = await TranslationStatsModel.aggregate([
        { $match: { project_status: false } },
        {
          $group: {
            _id: { office: "$office", genres: "$genres" },
            totalRealCharacters: { $sum: "$real_characters" },
            totalPeopleNum: { $sum: "$people_num" },
          },
        },
        {
          $group: {
            _id: "$_id.genres",
            offices: {
              $push: {
                office: "$_id.office",
                average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
              },
            },
            totalRealCharacters: { $sum: "$totalRealCharacters" },
            totalPeopleNum: { $sum: "$totalPeopleNum" },
          },
        },
        {
          $project: {
            genres: "$_id",
            offices: 1,
            general_average: { $divide: ["$totalRealCharacters", "$totalPeopleNum"] },
            _id: 0,
          },
        },
      ]);
  
      if (!result.length) {
        return next(new AppError("No documents found", 404));
      }
      res.status(200).json({
        status: "Success",
        result: result,
      });
    }
  );
  

