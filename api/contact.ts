import { handleCreateContactMessage } from "../server/api-handlers";

export default async function handler(req: any, res: any) {
  return handleCreateContactMessage(req, res);
}
