// --------------------------------------------------
// Environment preload file
// --------------------------------------------------
// This file is imported BEFORE anything else in the app.
// It guarantees process.env is populated for all modules.

import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
