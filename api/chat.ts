import { handleChat } from "../server/api-handlers";

export default async function handler(req: any, res: any) {
  return handleChat(req, res);
}
