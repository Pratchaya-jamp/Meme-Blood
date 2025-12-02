import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("data/db.json"); // ✅ ชี้มาที่ไฟล์ในโฟลเดอร์ data
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: [
    "https://memeblood-vue.netlify.app/" // production (หลัง deploy)
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server is running on port ${PORT}`);
});
