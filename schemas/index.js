const mongoose = require("mongoose");
mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/assi1");
    console.log("몽고디비 연결 성공");
  } catch (err) {
    console.error("몽고디비 연결 에러", err);
  }
};

module.exports = connect;
