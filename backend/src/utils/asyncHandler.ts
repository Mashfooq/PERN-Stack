const asyncHandler = (requestHandler: (arg0: any, arg1: any, arg2: (arg0: any) => any) => any) => {
    return (req: any, res: any, next: (arg0: any) => any) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }