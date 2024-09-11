import { Schema, model, models, Document } from "mongoose";
import shortid from "shortid";

export interface UrlDocument extends Document {
  key: string;
  url: string;
  clicked: number;
}

const UrlSchema = new Schema<UrlDocument>({
  key: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  url: { type: String, required: true },
  clicked: { type: Number, default: 0 },
});

UrlSchema.pre('save', async function (next) {
  const url = this as UrlDocument;

  if (!url.key) {
    url.key = shortid.generate();
  }

  const existingUrl = await Urls.findOne({ key: url.key });
  if (existingUrl) {
    url.key = shortid.generate();
  }

  next();
});

const Urls = models.Urls || model<UrlDocument>("Urls", UrlSchema);

export default Urls;
