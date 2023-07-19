import { type Event as NostrEvent } from 'nostr-tools';
import dbLocal from 'db-local';
import crypto from 'node:crypto';

const { Schema } = new dbLocal({ path: "./data" });

export const Zaps = Schema("Zaps", {
  _id: { type: String, required: true },
  author: { type: String, default: "" },
  event: { type: String, default: "" },
  zaps: { type: Number, default: 0 },
  createdAt: { type: Number, default: 0 },
});

export const zapExists = (eventId: string): boolean => {
  const data = Zaps.find({
    event: eventId
  });

  if (data.length) {
    return true;
  }

  return false;
}

export const saveZap = (author: string, note: string, amount: number) => {
  const zap = Zaps.create({
    _id: crypto.randomBytes(16).toString("hex"),
    author,
    event: note,
    zaps: amount,
    createdAt: Date.now()
  });
  zap.save();
}