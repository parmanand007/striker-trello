import {ID,storage} from "@/appwrite"

const uploadImage  =async(file:File)=>{
    if(!file) return;

    const fileUploaded = await storage.createFile(
        "64fdcbde36e32694ad63",
        ID.unique(),
        file
    )
    return fileUploaded
}

export default uploadImage