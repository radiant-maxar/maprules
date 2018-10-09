# MapRules 
Custom mapping presets and validation rules

<!-- ![](./assets/logo.png =250x) -->


### About

MapRules is an api service that allows mappers and mapping campaign managers to define custom mapping presets and validation rules usable in OpenStreetMap Editors. 

The goal of MapRules is to simplify OpenStreetMap feature tagging and validation.

### Documentation

- [MapRules Configuration Spec](https://github.com/maprules/maprules/blob/develop/maprules.spec.md)
- [Validation Scenarios](https://github.com/maprules/maprules/blob/develop/maprules.validation.scenarios.md) 
- [Api Documentation](https://github.com/maprules/maprules/blob/develop/maprules.apidocs.md)

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
yarn install --save sqlite3
yarn install
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
