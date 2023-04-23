const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    index: true,
    useUnifiedTopology: true,
  };

  mongoose
    .connect(process.env.MONGODB_URI, connectionParams)
    .then(() => {
      console.log("Connection to database successful");
    })
    .catch((err) => {
      console.log("Connection to database failed: " + err.message);
    });
};
