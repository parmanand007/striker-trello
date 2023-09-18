import { storage } from "@/appwrite";
// import { Storage } from "appwrite";
import {Image} from "@/typing"

const getUrl = async(image:Image)=>{
    console.log("getUrl",image.bucketId,image.fileId)
    const url = storage.getFilePreview(image.bucketId,image.fileId)
    return url
}

export default getUrl