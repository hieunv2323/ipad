import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

declare global {
  namespace Express {
    interface Request {
      env?: Env;
    }
  }
}
