import { NextApiRequest, NextApiResponse } from "next";
import { findUrlByKey, createShortUrl, getAllUrls, incrementClickCount } from "../services/urlService";

export async function handleRedirect(req: NextApiRequest, res: NextApiResponse) {
  const { key } = req.query;
  const urlData = await incrementClickCount(key as string);

  if (urlData) {
    res.redirect(urlData.url);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
}

export async function handleUrlCreation(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "Please provide a URL" });
  }
  
  const newUrl = await createShortUrl(url);
  res.status(201).json(newUrl);
}

export async function handleGetAllUrls(req: NextApiRequest, res: NextApiResponse) {
  const urls = await getAllUrls();
  res.status(200).json(urls);
}
