import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import GlossaryModel from "../models/glossary";
import { catchAsync } from "../util/catchAsync";

export const getGlossaries: RequestHandler = catchAsync(async (req, res) => {
    const glossaries = await GlossaryModel.find().exec();
    res.status(200).json(glossaries);
});

export const getGlossary: RequestHandler = catchAsync(async (req, res) => {
  const glossary_id = req.params.glossary_id;
    if (!mongoose.isValidObjectId(glossary_id)) {
      throw createHttpError(400, "Invalid Glossary ID");
    }
    const glossary = await GlossaryModel.findById(glossary_id).exec();

    if (!glossary) {
      throw createHttpError(404, "Glossary not found!");
    }
    res.status(200).json(glossary);
  });

export const filterGlossary: RequestHandler = async (req, res, next) => {
  const filter = req.query;
  try {
    const response = await GlossaryModel.find(filter);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getData: RequestHandler = async (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 100;

  try {
    const total = await GlossaryModel.countDocuments();
    const pageData = await GlossaryModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      total,
      data: pageData,
    });
  } catch (error) {
    next(error);
  }
};

interface GlossaryRequestBody {
  id: string;
  Num: number;
  JPN: string;
  CNZh: string;
  CNZh_Terra: string;
  CNTW: string;
  ENG: string;
  JPN_Title: string;
  CNZh_Title: string;
  Platform: string;
  Code_Name: string;
  iQue_Available: boolean;
  NorthPort_Available: boolean;
  Created_Time: string;
}

export const createGlossary: RequestHandler<
  unknown,
  unknown,
  GlossaryRequestBody,
  unknown
> = async (req, res, next) => {
  const id = req.body.id;
  const Num = req.body.Num;
  const JPN = req.body.JPN;
  const CNZh = req.body.CNZh;
  const CNZh_Terra = req.body.CNZh_Terra;
  const CNTW = req.body.CNTW;
  const ENG = req.body.ENG;
  const JPN_Title = req.body.JPN_Title;
  const CNZh_Title = req.body.CNZh_Title;
  const Platform = req.body.Platform;
  const Code_Name = req.body.Platform;
  const iQue_Available = req.body.iQue_Available;
  const NorthPort_Available = req.body.NorthPort_Available;
  const Created_Time = req.body.Created_Time;

  try {
    if (!Num) {
      throw createHttpError(400, "The Num must be Required");
    }
    const newGlossary = await GlossaryModel.create({
      id: id,
      Num: Num,
      JPN: JPN,
      CNZh: CNZh,
      CNZh_Terra: CNZh_Terra,
      CNTW: CNTW,
      ENG: ENG,
      JPN_Title: JPN_Title,
      CNZh_Title: CNZh_Title,
      Platform: Platform,
      Code_Name: Code_Name,
      iQue_Available: iQue_Available,
      NorthPort_Available: NorthPort_Available,
      Created_Time: Created_Time,
    });
    res.status(201).json(newGlossary);
  } catch (error) {
    next(error);
  }
};
