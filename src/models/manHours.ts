import { InferSchemaType, model, Schema } from "mongoose";

interface manHourDocument {
  ceshi_sum: number;
  mc2_ceshi: number;
  fanyi_sum: number;
  mc2_fanyi: number;
}

const manHourSchema = new Schema({
  projects: { type: String, required: true },
  slug: { type: String },
  fanyi_sum: { type: Number },
  ceshi_sum: { type: Number },
  mc2_ceshi: { type: Number },
  mc2_fanyi: { type: Number },
  all_sum: { type: Number },
  ceshi_pg: {
    type: Number,
    default: function (this: manHourDocument) {
      if (this.mc2_ceshi === 0) {
        return 0;
      } else {
        return this.ceshi_sum / this.mc2_ceshi;
      }
    },
  },
  fanyi_pg: {
    type: Number,
    default: function (this: manHourDocument) {
      if (this.mc2_fanyi === 0) {
        return 0;
      } else {
        return this.fanyi_sum / this.mc2_fanyi;
      }
    },
  },
});

type manHour = InferSchemaType<typeof manHourSchema>;
export default model<manHour>("manHour", manHourSchema);
