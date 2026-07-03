import { handleGetContactMessages } from "../../server/api-handlers.js";

export default async function handler(req: any, res: any) {
  return handleGetContactMessages(req, res);
}
