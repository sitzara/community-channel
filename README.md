# Community Channel

## Description

Community Channel is an API which allows:
- Create a room
- Add a user to a room
- Send a message to a room
- Get latest messages from a room

## Installation

```bash
$ npm install
```

## Running the app

The app requires MongoDB to be run. Credentials must be set in `.env` file (see `.env.example`)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# docker mode
$ npm run start:docker
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation
After running the application, documentation can be found [localhost:3000/docs](localhost:3000/docs)

## Leftovers
- Improve Authentication
