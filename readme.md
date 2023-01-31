# pcu software

## setup

```
git clone https://github.com/pointcomfort/pcu-software.git
yarn install
yarn create:env
```

replace the following entries:

- PLAYWRIGHT_USERNAME
- PLAYWRIGHT_PASSWORD

## start app

- yarn start
- yarn restart (does not open browser)

## build app

- yarn build:staging
- yarn build:production

## linting

- yarn eslint
- yarn eslint:fix

## tests

tests were created using [playwright](https://playwright.dev)

```
yarn test:server
yarn test
```
