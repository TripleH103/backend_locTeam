import { RequestHandler } from "express";
import manHourModel from '../models/manHours';

export const getAllHours: RequestHandler = async (req, res, next) => {
    try {
        const response = await manHourModel.find().exec();
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
};

interface CreateManHoursBody {
    all_sum?: number;
    ceshi_pg?: number;
    ceshi_sum?: number;
    fanyi_pg?: number;
    fanyi_sum?: number;
    mc2_ceshi?: number;
    mc2_fanyi?: number;
    projects?: string;
    slug?: string;
}

export const createManHours: RequestHandler<unknown,unknown,CreateManHoursBody,unknown> = async (req, res, next) => {
    const all_sum = req.body.all_sum;
    const ceshi_sum = req.body.ceshi_sum;
    const fanyi_sum = req.body.fanyi_sum;
    const mc2_ceshi = req.body.mc2_ceshi;
    const mc2_fanyi = req.body.mc2_fanyi;
    const projects = req.body.projects;
    const slug = req.body.slug;

    try {
        const newManHours = await manHourModel.create({
            all_sum: all_sum,
            ceshi_sum: ceshi_sum,
            fanyi_sum: fanyi_sum,
            mc2_ceshi: mc2_ceshi,
            mc2_fanyi: mc2_fanyi,
            projects: projects,
            slug: slug,
        });
        res.status(201).json(newManHours)

    } catch (error) {
        next(error);
    }
};