import { NextApiRequest, NextApiResponse } from "next";
import { handleUrlCreation, handleGetAllUrls } from "../../controllers/urlController";
import connectMongo from "../../utils/connectMongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  if (req.method === "GET") {
    await handleGetAllUrls(req, res);
  } else if (req.method === "POST") {
    await handleUrlCreation(req, res);
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
