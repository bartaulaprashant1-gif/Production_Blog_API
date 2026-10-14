import {Schema, model, Types} from 'mongoose';

 export interface IComment{
    blogId:Types.ObjectId,
    userId:Types.ObjectId
    content:string
}

const commentSchema= new Schema<IComment>({
    blogId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:[true, 'content is required'],
        maxLength:[1000, 'content must be less than 1000 characters']
    }
})

export default model<IComment>('Comment', commentSchema);