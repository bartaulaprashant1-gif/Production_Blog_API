import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';
 export interface IUser{
    username: string,
    email:string, 
    password:string,
    role:'admin' | 'user'
    firstName:string,
    lastName:string,
    socialLinks ?: {
        website?:string,
        github?:string,
        facebook?:string,
        instagram?:string,
        linkedin?:string
        x?:string,
        youtube?:string
    }
 }

//  user Schema 
const userSchema=new Schema<IUser>({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, 'Username must be unique'],
        maxLength: [20, 'username must be less than 20 characters']
    },
    email:{
        type: String,
        required: [true, "email is required"],
        maxLength: [50, 'email must be less than 50 characters'],
        unique:[true, "email must be unique"],
    },
    password:{
        type: String,
        required: [true, "password is required"],
        select: false
    },
    role: {
        type: String,
        enum:{
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        },
        defaults:'user'
    },
    firstName:{
        type: String,
        maxLength: [20, 'first name must be less than 20 characters']
    },
    lastName: {
        type: String,
        maxLength: [20, 'last name must be less than 20 characters']
    },
    socialLinks:{
        website:{
            type: String,
            maxLength:[100, 'website address must be less than 100 characters'],
        },
        facebook:{
            type: String,
            maxLength:[100, 'Facebook profile url must be less than 100 characters'],
        },
        instagram:{
            type: String,
            maxLength:[100, 'instagram profile url must be less than 100 characters'],
        },
        x:{
            type: String,
            maxLength:[100, 'X profile url must be less than 100 characters'],
        },
        github:{
            type: String,
            maxLength:[100, 'github profile url must be less than 100 characters'],
        },
        linkedin:{
            type: String,
            maxLength:[100, 'linkedin profile url must be less than 100 characters'],
        },
        youtube:{
            type: String,
            maxLength:[100, 'youtube profile url must be less than 100 characters'],
        }
     
    }
}, {timestamps:true});


userSchema.pre('save', async function( ) {
    if(!this.isModified('password')){
        return;
    }
    
    //hash the password
    this.password=await bcrypt.hash(this.password, 10);
})

export default model<IUser>('User', userSchema);
