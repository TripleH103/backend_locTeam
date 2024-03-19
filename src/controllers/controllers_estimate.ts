import { RequestHandler } from "express";
import EstimateModel from "../models/estimates";
import { catchAsync } from "../util/catchAsync";

export const getEstimates: RequestHandler = catchAsync(async (req, res) => {
    const project = req.query.project;
    const result = await EstimateModel.aggregate([
        { $match: { project: project } },
        { $facet: {
            estimateSubTask: [
                { $group: { _id: '$content', estimateSubCost: { $sum: '$working_time_est'}}}
            ],
            estimateProject: [
                { $group: { _id: null, estimateProjectCost: { $sum: '$working_time_est'}}}
            ]
        }}
    ]);

    res.status(200).json({
        status:"Success",
        result
    })
});