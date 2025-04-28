const express = require("express");
const cors = require("cors");
const app = express();

// 配置跨域
app.use(cors({ origin: "*" }));

// SSE 核心路由
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 发送系统状态事件（可选）
  res.write("event: status\n");
  res.write("data: {\"state\": \"connected\"}\n\n");

  // 每 3 秒推送时间戳数据
  const timer = setInterval(() => {
    const data = {
      time: new Date().toISOString(),
      message: "来自 Glitch 的实时推送"
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 3000);

  // 客户端断开处理
  req.on("close", () => {
    clearInterval(timer);
    res.end();
  });
});

// 静态文件服务（用于前端测试）
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log(`服务运行在 http://localhost:${PORT}`));