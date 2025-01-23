import  Mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true,'pashovvsword is required'],
      minlength: 8,
      maxlength: 15
    },
    role: {
      type: String,
      enum: ['customer', 'admin'], // Define user roles
      default: 'customer',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function(next) {
  
  if(!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password,10)
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
      { 
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY, 
      });
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
      { 
        id: this._id 
      },
      process.env.REFRESH_TOKEN_SECRET, 
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY, 
      });
}





// Export the model
module.exports = mongoose.model('User', userSchema);
