# ai sales agent engine

this project is a monorepo that uses `pnpm` as a global package manager

`/www` => nextjs (app router), tailwind

`/backend` => nodejs, express application

## requirements

install the `pnpm` package manager

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

you need to have `sox` installed on your machine. you can do that like so:

```bash
brew install sox
```

## install packages concurrently

```bash
pnpm install
```

## run projects concurrently

```bash
pnpm dev
```

## start project as a background process with pm2

```bash
pm2 start pnpm --  start:prod
```
