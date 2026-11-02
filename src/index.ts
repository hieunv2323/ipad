import { EventEmitter } from 'events';
import { Readable } from 'stream';
import app from './app';
import { Env } from './types/env';

/**
 * Custom Cloudflare Worker Fetch Adapter for Express.js
 * Bridges Cloudflare Workers Fetch events to Node.js http.IncomingMessage & http.ServerResponse
 * without mutating read-only Request properties.
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const url = new URL(request.url);

        // 1. Prepare Request stream & headers
        const reqStream = new Readable();
        reqStream._read = () => {};

        if (request.body && request.method !== 'GET' && request.method !== 'HEAD') {
          const bodyBuffer = await request.arrayBuffer();
          reqStream.push(Buffer.from(bodyBuffer));
        }
        reqStream.push(null);

        const reqHeaders: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          reqHeaders[key.toLowerCase()] = value;
        });

        // Construct mock Node IncomingMessage
        const req = Object.assign(reqStream, {
          url: url.pathname + url.search,
          method: request.method,
          headers: reqHeaders,
          httpVersion: '1.1',
          httpVersionMajor: 1,
          httpVersionMinor: 1,
          env,
          ctx
        });

        // 2. Prepare Response mock & headers
        const headers = new Headers();
        const responseChunks: Uint8Array[] = [];
        const resEmitter = new EventEmitter();

        const res = Object.assign(resEmitter, {
          statusCode: 200,
          statusMessage: 'OK',
          headersSent: false,
          setHeader(name: string, value: any) {
            headers.set(name, Array.isArray(value) ? value.join(', ') : String(value));
            return res;
          },
          getHeader(name: string) {
            return headers.get(name);
          },
          removeHeader(name: string) {
            headers.delete(name);
          },
          hasHeader(name: string) {
            return headers.has(name);
          },
          writeHead(code: number, message?: any, hdrs?: any) {
            this.statusCode = code;
            if (typeof message === 'string') {
              this.statusMessage = message;
            } else if (typeof message === 'object' && message !== null) {
              hdrs = message;
            }
            if (hdrs) {
              for (const [k, v] of Object.entries(hdrs)) {
                this.setHeader(k, v);
              }
            }
            this.headersSent = true;
            return res;
          },
          write(chunk: any) {
            if (chunk) {
              if (typeof chunk === 'string') {
                responseChunks.push(Buffer.from(chunk));
              } else {
                responseChunks.push(chunk);
              }
            }
            return true;
          },
          end(chunk: any) {
            if (chunk) {
              this.write(chunk);
            }
            this.headersSent = true;

            const responseBody = Buffer.concat(responseChunks);
            const response = new Response(responseBody, {
              status: this.statusCode,
              headers
            });
            resolve(response);
          }
        });

        // Execute Express middleware stack
        app(req as any, res as any);
      } catch (err) {
        reject(err);
      }
    });
  }
};
