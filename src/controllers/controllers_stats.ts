import { RequestHandler } from "express";
import StatsModel from "../models/stats";
import { catchAsync } from "../util/catchAsync";
import AppError from "../util/appError";
import APIFeatures from "../util/APIFeature";

export const getProjectWorkingTime: RequestHandler = catchAsync(async (req, res, next) => {
    const workingTimes = new APIFeatures(StatsModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
    const records = await workingTimes.query;

    if(records.length === 0) {
        next(new AppError("There is no projects in the database", 404))
    }
    res.status(200).json({
        status: "Success",
        records
    })
});

export const getUniqueProject: RequestHandler = catchAsync(async (req, res, next) => {
    const uniqueProject = await StatsModel.distinct('project');
    if(uniqueProject.length === 0) {
        next(new AppError("There is no project int the database", 404))
    }
    res.status(200).json({
        status:"Success",
        number: uniqueProject.length,
        uniqueProject
    })
});

export const getProjectStats: RequestHandler = catchAsync(async (req, res) => {
    const project = req.query.project;
    const result = await StatsModel.aggregate([
        { $match: { project: project } },
        { $facet: {
            totalSubTask: [
                { $group: { _id: '$sub_task', subCost: { $sum: '$working_time'}}}
            ],
            totalProject: [
                { $group: { _id: null, projectCost: { $sum: '$working_time'}}}
            ]
        }}
    ]);

    res.status(200).json({
        status:"Success",
        result
    })
});

export const getPersonalProjectStats: RequestHandler = catchAsync(async (req, res) => {
    const project = req.query.project;
    const personResult = await StatsModel.aggregate([
        { $match: { project: project } },
        { $facet: {
            personTotalSubTask: [
                { $group: { _id: { sub_task: '$sub_task', pokemon: '$pokemon' }, subCost: { $sum: '$working_time'}}}
            ],
            personTotalProject: [
                { $group: { _id: '$pokemon', personProjectCost: { $sum: '$working_time'}}}
            ]
        }}
    ]);

    res.status(200).json({
        status:"Success",
        personResult
    })
});