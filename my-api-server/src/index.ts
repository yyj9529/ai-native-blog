import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());

// 사용자 라우트 등록
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
