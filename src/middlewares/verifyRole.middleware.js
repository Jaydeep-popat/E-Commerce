import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifySeller = asyncHandler(async (req, _, next) => {

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  console.log("req.user.role");

  if (req.user.role !== "seller") {
    throw new ApiError(403, "Access denied. Only sellers can access this resource.");
  }

  next(); // Proceed to the next middleware/controller
});
