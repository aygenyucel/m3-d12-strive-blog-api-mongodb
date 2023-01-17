export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    console.log("NOT FOUND ERROR HANDLER JUST TRIGGERED");
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};
