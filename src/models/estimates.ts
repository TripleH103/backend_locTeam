import { Schema, model, InferSchemaType } from "mongoose";

const estimateSchema = new Schema({
    project: {
        type: String,
    },
    content: {
        type: String,
    },
    working_time_est: {
        type: Number,
    }
});

type Estimate = InferSchemaType<typeof estimateSchema>;
export default model<Estimate>("Estimates", estimateSchema);