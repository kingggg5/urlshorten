import Urls, { UrlDocument } from "../models/urls";

export async function findUrlByKey(key: string): Promise<UrlDocument | null> {
  return Urls.findOne({ key });
}

export async function createShortUrl(url: string): Promise<UrlDocument> {
  return Urls.create({ url });
}

export async function getAllUrls(): Promise<UrlDocument[]> {
  return Urls.find();
}

export async function incrementClickCount(key: string): Promise<UrlDocument | null> {
  const urlEntry = await Urls.findOne({ key });
  if (urlEntry) {
    urlEntry.clicked += 1;
    await urlEntry.save();
  }
  return urlEntry;
}
