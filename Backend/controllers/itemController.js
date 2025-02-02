import itemModel from "../models/itemModel.js"
import fs from 'fs'

//add fooditem

const addItem = async(req,res) => {
    //chatgpt
    // try{
    //     if(!req.file){
    //         return res.status(400).json({success:false,message:"No file uploaded"});
    //     }
    // //end
    // console.log(req.body);
    // console.log(req.file);
    let image_filename = `${req.file.filename}`;
    // console.log('mainuddin');
    // console.log(image_filename);

    const item = new itemModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
    });

    try{

        await item.save();
        res.json({success:true,message:"Food item Added"});
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
};

//list item
const listItem = async (req,res) => {
    try{
        const items = await itemModel.find({});
        res.json({success:true,data:items})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food item
const removeItem = async (req, res) => {
    try{
        const item = await itemModel.findById(req.body.id);
        fs.unlink(`uploads/${item.image}`,()=>{})

        await itemModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export{addItem,listItem,removeItem}