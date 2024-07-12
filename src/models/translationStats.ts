import { Schema, model, InferSchemaType } from "mongoose";

const translationStatsSchema = new Schema({
    project: {
        type: String,
    },
    office: {
        type: String,
    },
    genres: {
        type: String,
    },
    date: {
        type: Date,
    },
    total_characters: {
        type: Number,
    },
    real_characters: {
        type: Number,
    },
    people_num: {
        type: Number,
    },
    plan_progress: {
        type: Number,
    },
    cnzh_progress: {
        type: Number,
    },
    twzh_progress: {
        type: Number,
    },
    project_status: {
        type: Boolean,
    },

});

type TranslationStats = InferSchemaType<typeof translationStatsSchema>;
export default model<TranslationStats>("TranslationStats", translationStatsSchema);