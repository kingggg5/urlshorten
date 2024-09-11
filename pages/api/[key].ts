import { NextApiRequest, NextApiResponse } from "next";
import { handleRedirect } from "../../controllers/urlController";
import connectMongo from "../../utils/connectMongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  if (req.method === "GET") {
    await handleRedirect(req, res);
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
