import { Schema, model, InferSchemaType } from "mongoose";

const debugStatsSchema = new Schema({
    project: {
        type: String,
    },
    office: {
        type: String,
    },
    date: {
        type: Date,
    },
    total_label: {
        type: Number,
    },
    real_label: {
        type: Number,
    },
    people_num: {
        type: Number,
    },
    plan_progress: {
        type: Number,
    },
    real_progress: {
        type: Number,
    },
    project_status: {
        type: Boolean,
    }
});

type DebugStats = InferSchemaType<typeof debugStatsSchema>;
export default model<DebugStats>("DebugStats", debugStatsSchema);