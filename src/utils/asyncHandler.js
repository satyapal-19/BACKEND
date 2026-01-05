// const asyncHandler =  (requestHandler) => async(req,res,next)=>{
// try {
//       //  a utility for using try catch in async fnc
// } catch (error) {
//     res.status(error.code ||404 ).json({
//         success: false ,
//         message : error.message
//     })
// }
// }
// export {asyncHandler}

// -------------------------------------------------------
// using promises as a utility (CORRECTED VERSION)
// -------------------------------------------------------

const asyncHandler = (requestHandler) => {
  // IMPORTANT:
  // We must RETURN a middleware function
  // Express expects (req, res, next) as return value
  return (req, res, next) => {

    // Promise.resolve ensures:
    // - async function errors are converted to rejected promises
    // - sync errors are also handled safely
    Promise
      .resolve(requestHandler(req, res, next))

      // If any error occurs, it is forwarded to Express
      // error-handling middleware using next(error)
      .catch((error) => {
        next(error);
      });
  };
};

export { asyncHandler };
