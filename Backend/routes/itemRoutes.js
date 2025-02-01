import express from 'express'
import { addItem,listItem } from '../controllers/itemController.js'
import multer from "multer"

const itemRouter = express.Router();


//image storage engine

const storage = multer.diskStorage({
   // destination:"uploads",
    destination:(req, file, cb) => {
        cb(null, "uploads"); // Ensure the `uploads` directory exists
      },
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

itemRouter.post("/add",upload.single("image"),addItem)
itemRouter.get("/list",listItem)



export default itemRouter;