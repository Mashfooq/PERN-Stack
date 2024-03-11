import { asyncHandler } from "../utils/asyncHandler.js"

const healthCheck = asyncHandler(async (req, res) => {
    // Respond with an "OK" status and a message
    res.status(200).json({ message: "Health check OK" });
})

export {
    healthCheck
}
