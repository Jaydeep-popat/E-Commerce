import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { User}  from '../models/user.model.js'
import {apiResponse} from '../utils/apiResponse.js'

const registerUser = asyncHandler( async (req, res) => {


    //we need fullname ,username, email, password from user

    const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }] 
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        fullName,
        email, 
        password,
        username
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new (500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )
})
export {
    registerUser
}
