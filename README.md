# datasources-dataloader-advanced

> Apollo-mongo-datasource, Dataloader, handle cache with Redis

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![MIT License][license-shield]][license-url]

This project is guide start with mongoDatasource, Dataloader and handle cache with Redis.

![](https://github.com/othneildrew/Best-README-Template/raw/master/images/logo.png)

<!-- GETTING STARTED -->

## Installing / Getting started

- You must be a member and added ssh key of workspace on bitbucket/gitlab. Clone the repo

```sh
git clone git@github.com:vunguyen2009techdev/datasources-dataloader-advanced.git
```

## Development setup

### Built With

- apollo-datasource@0.7.2

- apollo-server-cache-redis@1.2.2

- dataloader@2.0.0

- mongoose@5.10.12

- ...

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- NodeJS v14.4.x

- MongoDB v4.x


### Setting up

Follow all step bellow to setup your dev environment

1. Start your mongodb (We are using Docker for environment setup)

```sh
docker run -d --restart always --name mongo - p 27017:27017 mongo:4

docker run --name redis-cluster -d -e "IP=0.0.0.0" -p 7000-7005:7000-7005  grokzen/redis-cluster:latest
```

2. Setup environment variables.
   Create environment config file and config `mongo` connection params

```sh
cp .env.example .env
```

3. Install NPM packages

```sh
yarn install
```

4. Create seeding DB:

```sh
yarn seed
```

5. Run development:

```sh
yarn dev
```

## Configuration

On `.env`, you must config all environment variables bellow. By default, `.env.example` is used default config for all service.

```
# Redis Config
REDIS_CLUSTER_DEFAULT_HOST_ONE=127.0.0.1
REDIS_CLUSTER_DEFAULT_PORT_ONE=7000,7001,7002,7003,7004,7005


# Mongo Config
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DB_NAME=demo-dataloader-advanced
```

## Versioning

- [Current] `beta`: All code is on `master`


## Contributing

1. Fork it (<https://github.com/vunguyen2009techdev/datasources-dataloader-advanced.git>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Licensing

vunguyen2009techdev – [@DEV](anhvu.hcmus.2012@gmail.com) – anhvu.hcmus.2012@gmail.com

Private License.

All Rights Reserved

- Unauthorized copying of this file, via any medium is strictly prohibited
- Proprietary and confidential

[npm-image]: https://img.shields.io/npm/v/npm
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt