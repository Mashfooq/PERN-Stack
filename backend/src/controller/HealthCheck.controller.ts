import { asyncHandler } from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    // Respond with an "OK" status and a message
    res.status(200).json({ message: "Health check OK" });
})

export {
    healthcheck
}
