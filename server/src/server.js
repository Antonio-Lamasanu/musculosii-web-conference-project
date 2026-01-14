require("dotenv").config();
const app = require("./app");
const { testDbConnection } = require("./config/db");

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await testDbConnection();
    console.log("✅ DB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Bootstrap failed:", err.message);
    process.exit(1);
  }
}

bootstrap();
