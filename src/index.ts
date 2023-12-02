import express,{Request,Response,NextFunction, Application} from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
const PORT = 4444;
const app : Application = express();
app.use(cors());
app.use(cookieParser());

app.get('/hey',(req : Request,res:Response,next : NextFunction)=>{
    res.status(200).send("Hey from me!!");
})

app.listen(PORT,()=> console.table(`Listening on ${PORT}`));