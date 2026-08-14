import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env.test.local'), override: true });

if (!process.env.DATABASE_URL?.includes('jasbuiltdb_test')) {
  throw new Error(
    'Refusing to run tests: DATABASE_URL does not point at the test database (jasbuiltdb_test). Check .env.test.local.'
  );
}
