# MapRules
Custom mapping presets and validation rules

<!-- ![](./assets/logo.png =250x) -->


### About

MapRules is an api service that allows mappers and mapping campaign managers to define custom mapping presets and validation rules usable in OpenStreetMap Editors.

The goal of MapRules is to simplify OpenStreetMap feature tagging and validation.

#### Documentation

- [MapRules Configuration Spec](https://github.com/radiant-maxar/maprules/blob/master/maprules.spec.md)
- [Validation Scenarios](https://github.com/radiant-maxar/maprules/blob/master/maprules.validation.scenarios.md)
- [Api Documentation](https://github.com/radiant-maxar/maprules/blob/master/maprules.apidocs.md)

#### Contributing
- [Code of Conduct](https://github.com/radiant-maxar/maprules/blob/master/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/radiant-maxar/maprules/blob/master/CONTRIBUTING.md)

#### Links to other MapRules Repos

- [MapRules User Interface](https://github.com/radiant-maxar/maprules-ui)
- [iD Fork](https://github.com/radiant-maxar/iD/tree/remote-presets)
- [JOSM Plugin](https://github.com/radiant-maxar/maprules-josm)
- [MapCSS Parse](https://github.com/radiant-maxar/mapcss-parse)
- [Tasking Manager 2 Fork](https://github.com/radiant-maxar/osm-tasking-manager2/tree/maprules-dev)


...see the [Architecture](https://github.com/radiant-maxar/maprules/blob/develop/ARCHITECTURE.md) for a technical description of the repos work together

## Getting Started

### Install Dependencies

#### Install sqlite

ubuntu!
```
sudo apt-get update
sudo apt-get install -yq sqlite3 libsqlite-dev
```

centos!
```
sudo yum update
sudo yum install -yq
```

mac!
```
brew install sqlite3
```

windows!

...use [this](https://mislav.net/rails/install-sqlite3/) for guidance!

#### use node 10.x

```
# with nvm installed and from root of MapRules directory...
nvm install #only run first time if you don't have the right version
nvm use
```

...see [here](https://github.com/creationix/nvm#installation) for setting up nvm on a linux machine
...see [here](https://github.com/coreybutler/nvm-windows#installation--upgrades) for setting up nvm on a windows machine

##### install node dependencies
```
yarn install -G sqlite3 && yarn install
```

### Development

#### Get Consumer Token and Consumer Secrete Keys from a development instance of OSM Site

A "development instance" of the OSM Site could be the [openstreetmap-website](https://github.com/openstreetmap/openstreetmap-website) that you clone and run on your machine, or (perhaps easier) you could be one of the development instances that OSM provides like https://master.apis.dev.openstreetmap.org


To actually get the tokens, once you have a login for your development instance, go to the `/user/username/oauth_clients/new` web page and fill out the form. When it comes to permissions, only select the `read their user preferences` checkbox. Use Consumer Token and Consumer Secret keys provided once you submit the form for the `CONSUMER_KEY` and `CONSUMER_SECRET` environmental variables. So too should you supply the development osm site you use as the `OSM_SITE` environmental variable.

#### build docs and icons lookup tables

...the iD editor's presets use very nice icons. the ICON lookup table tries to match the custom maprules presets with icons made for presets with matching tags

```
yarn build
```

#### Migrate the db and seed it with fixture data


```
NODE_ENV=development JWT=${some.jwt} yarn fixture
```

..note, the JWT value above needs to be used whenever running the app in the same NODE_ENV.

#### Spin up the server

```
yarn dev // propended with all needed env variables...
```

#### Test

```
yarn test // propended with all needed env variables...
```

*test with docker image*

```
docker build -f Dockerfile . && docker run MapRules /bin/bash -c 'npm run test:fixture // with needed environmental variables'
```

#### Configure process.yml

MapRules uses PM2 command line tool to manage the service when running in production.
If PM2 is for you, its certainly a great option for local development.

The process.yml file acts as the configuration file for PM2, and since it holds all the kinds of secret keys, you never want to commit this to a remote branch/make it exposed outside the machine you use to run maprules.

As such, and this might be overkill that can be changed in the future, the `process.yml` is built from a `process.yml.in`, which we keep gitignored.

So, create a process.yml.in file and place a configuration like the one below in it, using the client keys, osm site, and secret session/jwt keys for maprules. Note, we also give a fully hydrated example for the classic development, staging, production environment set used for software in a `process.yml.example` file.

```yml
apps:
   - name: maprules
   script: index.js
   env_production
      NODE_ENV: production
      PORT: ${YOUR.FAVORITE.PORT}
      HOST: ${YOUR.FAVORITE.HOST}
      CONSUMER_KEY: ${CONSUMER.KEY.FROM.OSM.SITE},
      CONSUMER_SECRET: ${CONSUMER.SECRET.FROM.OSM.SITE},
      OSM_SITE: ${URL.TO.OSM}
      YAR: ${PRIVATE.KEY.FOR.YAR},
      JWT: ${PRIVATE.KEY.FOR.JWT}
```

With everything in your `process.yml.in` file, run the build script again and you'll be ready to use PM2 as you need. The `prod` npm command is an example of how to get maprules running with pm2 for a configuration that matches the yml snippet above.

