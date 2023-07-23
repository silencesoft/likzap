import { finishEvent, nip57, type Event as NostrEvent } from 'nostr-tools';
import fetch from 'node-fetch';

import { pool } from '..';
import { nostrRelays, reactionsValues, secretKey, zapValue } from '../constants/config';
import { getProfile } from './profile';
import { connectToLndhubApi } from '../utils/lndhubapi';
import { saveZap, zapExists } from '../utils/database';

export const doPayment = async (event: NostrEvent) => {
  const { content } = event;
  const isReaction = reactionsValues.filter(reaction => reaction.type === content);
  let amount = 0;

  if (isReaction.length) {
    console.log(event);
    amount = isReaction[0].value;
  } else {
    amount = parseInt(zapValue);
  }

  const authorTag = event.tags.filter((tag: string[]) => tag[0] === 'p');
  const noteTag = event.tags.filter((tag: string[]) => tag[0] === 'e');
  const author = authorTag.length ? authorTag[0][1] : '';
  const note = noteTag.length ? noteTag[0][1] : '';

  if (!zapExists(note) && amount && author) {
    console.log(`Starting payment to ${note}.`);
    const invoice = await createInvoice(author, note, amount);
    const lndhub = await connectToLndhubApi();

    if (!lndhub) {
      console.log(`Error in payment server.`);
      return;
    }

    const doPayment = await lndhub.payInvoice(invoice, amount);

    if (doPayment.type === 'paid_invoice') {
      console.log(`Payment to ${note} done.`);
      saveZap(author, note, amount);
    }
  }
}

export const createInvoice = async (author: string, eventId: string, amount: number) => {
  if (!pool || !amount) {
    return {};
  }

  const comment = 'Zap event.';

  const zapEvent = nip57.makeZapRequest({
    profile: author,
    event: eventId,
    amount: amount * 1000,
    relays: nostrRelays,
    comment,
  });

  const user = await getProfile(author);

  if (!user.lud16 || !user.zapEndpoint) {
    console.log('No payment information.');
    return;
  }

  const zapInvoiceEvent = finishEvent(zapEvent, secretKey ?? '');

  pool.publish(zapInvoiceEvent, nostrRelays);

  const url = `${user.zapEndpoint}?amount=${amount * 1000}&nostr=${encodeURIComponent(
    JSON.stringify(zapInvoiceEvent)
  )}&comment=${encodeURIComponent(comment)}`;

  const res = await fetch(url);
  const { pr: invoice } = await res.json();

  return invoice;
};
