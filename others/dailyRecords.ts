import { InferSchemaType, model, Schema } from "mongoose";
import Users from "../src/models/users";
import Projects from "./projects";

const dailyRecordSchema = new Schema({
  participant: {
    type: Schema.Types.ObjectId,
    ref: Users,
    required: [true, "Please select a person"],
  },
  dailyRecording: [{
    relatedProject: {
      type: Schema.Types.ObjectId,
      ref: Projects
    },
    workingTime: [{
      
    }]

  }]
        
    
});

type dailyRecord = InferSchemaType<typeof dailyRecordSchema>;
export default model<dailyRecord>("dailyRecord", dailyRecordSchema);
