import dotenv from 'dotenv';
import {  nip19 } from 'nostr-tools';

dotenv.config();

const nPubKey = process.env.USER_PUBLIC_KEY;
const serverRelays = process.env.NOSTR_RELAYS;

export const secretKey = process.env.USER_SECRET_KEY ?? '';
export const zapValue = process.env.ZAP_VALUE ?? "0";
export const publicKey = nip19.decode(nPubKey ?? '');
export const nostrRelays = serverRelays?.split(',') || [];
