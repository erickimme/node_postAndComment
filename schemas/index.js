import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const connect = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.2f3ytju.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: 'post_and_comment', // 실제 DB이름
      },
    )
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default connect;
