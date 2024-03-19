import { Schema, model, InferSchemaType } from "mongoose";

const statsSchema = new Schema({
  pokemon: {
    type: String,
  },
  project: {
    type: String,
  },
  sub_task: {
    type: String,
  },
  working_time: {
    type: Number,
  },
  date: {
    type: Date,
  },
});

type Stats = InferSchemaType<typeof statsSchema>;
export default model<Stats>("Stats", statsSchema);
