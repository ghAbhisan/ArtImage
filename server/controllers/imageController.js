import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {  
    try {
        
const{userId, prompt}=req.body;
const user = await userModel.findById(userId);
if(!user || !prompt){
    return res.json({success:false, message:'Missing Details'});
}
if(user.creditBalance===0 || user.creditBalance<0){
    return res.json({success:false, message:'Insufficient Credits', creditBalance: user.creditBalance});
 }
const formData=new FormData();
formData.append('prompt', prompt);

const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
    headers: {
        'x-api-key': process.env.CLIPDROP_API,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer',
    })

    const based64Image = Buffer.from(data, 'binary').toString('base64');    
    const resultImage = `data:image/png;base64,${based64Image}`;
    await userModel.findByIdAndUpdate(userId, {creditBalance: user.creditBalance-1});
    res.json({success:true, message:"Image Generated", creditBalance: user.creditBalance-1, resultImage}); 

 } catch (error) {
     console.log(error);
     res.json({sucess: false, message: error.message});
 }
}

