/**
 * Boots Payload once to ensure the Postgres schema is created/synced in development.
 * Why: the dev push mode of the Postgres adapter creates tables on first boot; running this before
 * a build guarantees the sitemap/queries have tables to read. Not for production (use migrations).
 */
import { getPayload } from "payload";

import config from "../cms/payload.config";

const payload = await getPayload({ config });
payload.logger.info("Schema ensured.");
process.exit(0);
