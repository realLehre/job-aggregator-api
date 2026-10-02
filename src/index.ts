import app from "./server";

import { dbConnect } from "./db/db-connect";
import { startJobScraper } from "./utils/cron";

const port = process.env.PORT || "8080";

const startServer = async () => {
  try {
    await dbConnect(process.env.MONGODB_URI as string);
    await startJobScraper();
    app.listen(port, () => {
      console.log(`Server is running on port ${port} ok`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

startServer();
