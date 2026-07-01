import { Sequelize } from "sequelize";
import path from "path";

// Singleton pattern — avoids creating multiple connections during Next.js hot-reload in dev
declare global {
  // eslint-disable-next-line no-var
  var __sequelize: Sequelize | undefined;
}

const sequelize =
  global.__sequelize ??
  new Sequelize({
    dialect: "sqlite",
    storage: path.join(process.cwd(), "data", "atsgo.db"),
    logging: false,
  });

if (process.env.NODE_ENV !== "production") {
  global.__sequelize = sequelize;
}

export default sequelize;
