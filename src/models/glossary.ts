import { Schema, model, InferSchemaType } from "mongoose";

const glossarySchema = new Schema({
    Num:{ type:Number, required:true},
    JPN:{ type:String},
    CNZh:{ type:String},
    CNZh_Terra:{ type:String},
    CNTW:{ type:String},
    ENG:{ type:String},
    JPN_Title:{ type:String},
    CNZh_Title:{ type:String},
    Platform: { type:String},
    Code_Name:{ type:String},
    iQue_Available:{ type:Boolean},
    NorthPort_Available:{ type:Boolean},
    Created_Time:{ type:Date},
});

type Glossary = InferSchemaType<typeof glossarySchema>;
export default model<Glossary>("Glossary", glossarySchema);