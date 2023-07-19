# Likzap

A nostr bot to zap a note when you like it.

## Getting Started

Clone repository:

```bash
git clone https://github.com/silencesoft/likzap.git
cd likzap
cp .env.sample .env
```

With docker:

```bash
docker-compose build
docker-compose up -d
```

Local test and deployment:

```bash
yarn
yarn dev
```

Modify the environment variables file:

- USER_PUBLIC_KEY : Your npub key
- USER_SECRET_KEY : Your hex secret key
- NOSTR_RELAYS : A list of relays comma separated
- LNDHUB_URL : LNDHub server
- ZAP_VALUE : Zap amount

* There is a known bug with yarn build in nostr-relaypool library

## Thanks

Support: [npub1djxd9fd495r2llyjsx4aed0elcgy8fndw0pxx80pl0tuaa3kkuhq6r9mgy](nostr:npub1djxd9fd495r2llyjsx4aed0elcgy8fndw0pxx80pl0tuaa3kkuhq6r9mgy)

My Nostr Public key: [npub1gcmpunjrue2aq5um7qgnp4p6uxarlxw2z6djehaf0emxjf6gr9us548zdf](nostr:npub1gcmpunjrue2aq5um7qgnp4p6uxarlxw2z6djehaf0emxjf6gr9us548zdf)

Buy me a coffee (with satoshis): [https://lncoffee.me/silencesoft](https://lncoffee.me/silencesoft)
