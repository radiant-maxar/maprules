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

#### build docs & ui

```
yarn build
```

#### Migrate the db and seed it with fixture data

```
NODE_ENV=development yarn fixture
```

#### Spin up the server

```
yarn dev
```

#### Test

```
yarn test:fixture # tests need db w/data...
```

*test with docker image*

```
docker build -f Dockerfile . && docker run maprules /bin/bash -c 'npm run test:fixture'
```

#### configure for production

Edit the process.yml with desired hosts & ports...
