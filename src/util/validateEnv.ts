import { cleanEnv } from "envalid";
import { port,str } from 'envalid/dist/validators';

export default cleanEnv (process.env, {
    MONGO_CONNECTION_STRING:str(),
    MONGO_CONNECTION_PASSWORD:str(),
    NODE_ENV:str(),
    PORT: port(),
});
