import { InferSchemaType, model, Schema } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "You must input project name at first!"]
    },
    childTask: [{
        title: {
            type: String,
        },
    }]
});

type Projects = InferSchemaType<typeof projectSchema>;
export default model<Projects>('Projects', projectSchema);

