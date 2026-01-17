require("dotenv").config();
const app = require("./app");
const { sequelize, testDbConnection } = require("./config/db");
const { initModels } = require("./models");

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await testDbConnection();
    initModels(sequelize);
    await sequelize.sync();

    console.log("✅ DB synced");
    console.log("✅ DB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Bootstrap failed:", err);
    process.exit(1);
  }
}

bootstrap();
