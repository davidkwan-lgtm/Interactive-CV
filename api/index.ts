import { createApp } from "../server/app";

let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createApp();
  }

  const { app } = await appPromise;
  return app(req, res);
}
