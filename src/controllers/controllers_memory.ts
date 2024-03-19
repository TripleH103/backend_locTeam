import { RequestHandler } from "express";

import MemoryModel from "../models/memories";

interface filterParams {
  jpn_text: string;
  cnzh_text: string;
}

export const getIndexMemories: RequestHandler<
  unknown,
  unknown,
  unknown,
  filterParams
> = async (req, res, next) => {
  try {
    const jpn = req.query.jpn_text;
    const cnzh = req.query.cnzh_text;
    if (jpn) {
      const memories = await MemoryModel.find(
        { $text: { $search: jpn } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .exec();
      if (memories.length === 0) {
        res.status(200).json({ message: "No result" });
      } else {
        res.status(200).json({ memories, total: memories.length });
      }
    } else if (cnzh) {
      const memories = await MemoryModel.find(
        { $text: { $search: cnzh } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .exec();
      if (memories.length === 0) {
        res.status(200).json({ message: "no result" });
      } else {
        res.status(200).json({ memories, total: memories.length });
      }
    }
  } catch (error) {
    next(error);
  }
};

interface regexParams {
  jpn_text: string;
  cnzh_text: string;
}

interface searchObject {
  jpn_text?: { $regex: string; $options: string };
  cnzh_text?: { $regex: string; $options: string };
}

export const getRegexMemories: RequestHandler<
  unknown,
  unknown,
  unknown,
  regexParams
> = async (req, res, next) => {
  try {
    const jpn = req.query.jpn_text;
    const cnzh = req.query.cnzh_text;
    const query: searchObject = {};
    if (jpn) {
      query["jpn_text"] = { $regex: jpn, $options: "i" };
    }
    if (cnzh) {
      query["cnzh_text"] = { $regex: cnzh, $options: "i" };
    }
    const memories = await MemoryModel.find(query);
    if (memories.length === 0) {
      res.status(200).json({ message: "No results" });
    } else {
      memories.sort((a, b) => {
        if (jpn && a.jpn_text === jpn && b.jpn_text !== jpn) {
          return -1;
        }
        if (cnzh && a.cnzh_text === cnzh && b.cnzh_text !== cnzh) {
          return -1;
        }
        return 0;
      });
      const slugCounts = await MemoryModel.aggregate([
        { $match: query },
        { $group: { _id: "$slug", count: { $sum: 1 } } },
      ]);
      res.status(200).json({ memories, total:memories.length, slugCounts });
    }
  } catch (error) {
    next(error);
  }
};
