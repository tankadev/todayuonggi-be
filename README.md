# TodayUongGi API
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker
### Build
Syntax
```bash
docker build . -t <REPONAME>/<IMAGE_NAME>:<IMAGE_TAG> --platform=linux/amd64,linux/arm64
```

Example
```bash
docker build . -t todayuonggi/api:latest --platform=linux/amd64,linux/arm64
```
### Run
```bash
docker run -d -p 10600:10600 todayuonggi/api:latest
```

Run without exit
```bash
docker run -it --entrypoint=/bin/bash todayuonggi/api:latest
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
