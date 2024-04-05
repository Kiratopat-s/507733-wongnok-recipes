# About

A Wongnok web application designed to foster a vibrant community of food enthusiasts in Thailand and beyond.

## How to start dev

```bash
Install package
$ pnpm install

Start dev
$ pnpm dev

Start dev useing turbo pack (optional)
$ pnpm dev --turbo

Build project
$ pnpm build

Start server from builded project
$ pnpm start
```

ps. I use pnpm as node package management, you can use what you prefer (such as yarn, npm, bun, etc...)

### Don't forget to config .env file !

```.env
NEXTAUTH_URL=
LINE_CLIENT_ID=
LINE_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
```

## Tech Stack

- NEXTJS version 14.0.4
- Tailwind CSS + Daisy UI
- NextAuth.js
