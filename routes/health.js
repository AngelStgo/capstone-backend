//* One way to do it
// import { Router } from "express";
// const healthRouter = new Router;



//* Another way 
//what is the difference?
import express from "express";

export const healthRouter = express.Router();



healthRouter.get('/', (req, res) => {
    res.status(200).json({
        "status": "ok"
    })
});