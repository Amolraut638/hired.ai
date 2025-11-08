import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
}, {timestamps: true})

//for password comparing while login
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)  // this.password  means this is the password which is going to store into the database
}

//now using above user schema use have to create the user model
const User = mongoose.model("User", UserSchema)

export default User;  // with the help of this we can use this schema in any other file


//now we have to create the function to store the data into the database so we make the controller folder


