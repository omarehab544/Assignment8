import express from 'express';
import connectionDB from './DB/connectionDB.js';
import userRouter from './modules/users/user.controller.js';
import cors from "cors"


const app = express();
const port = 3000;

const bootstrap = async () => {

    app.use(cors({origin:"*"}))
    
    app.use(express.json());

    
    await connectionDB();
   

    app.use("/users", userRouter);
    


    app.get("/", (req, res) => {
        return res.status(200).json({ message: "Welcome to the application" });
    });

    
app.use((req, res) => {
    return res.status(404).json({ message: "Invalid URL / Route Not Found" });
});


app.use((err, req, res, next) => {

  const statusCode = err.cause || 500; 
  
  return res.status(statusCode).json({ 
    message: err.message, 
    stack: err.stack 
  });
});

    app.listen(port, () => {
        console.log(`app is running on port ${port}`);
    });
};

export default bootstrap;