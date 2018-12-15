# Architecture


## High Level Description

MapRules is a set of software components that together generate tagging preset/validation files easily adaptable into files usable in different OSM Editors and data validation tools.

For example...

I make a MapRules config file.
I download the MapRules JOSM plugin
I use that MapRules config for custom JOSM presets and validations that enforce MapRules Validations I wrote.

See the [Integrations paragraph](#integrations) for currently and 'in development' integrations.

## Software Components

### User Interface

#### Overview

The MapRules UI (currently under development) allows users to interactively build MapRules config files that are savable to an instance of the MapRules API (this repo!).

#### Technical details

- it is built using Angular
- suggested key value pairs are driven by [taginfo](https://taginfo.openstreetmap.org/)


### API

#### Overview

The 'API' refers to the API and database that stores the tagging rules and formats them to be usable in external editors and OSM validation tools.

#### Technical details

- the API is written using [hapijs](https://hapijs.com/). For full documentation regarding the API, check out its own [documentation](https://github.com/radiant-maxar/maprules/blob/master/maprules.apidocs.md)
- each editor/tool integration is made possible by an `adapter` modules and a schema module. These generate files that make presets/validations usable in integrations.
- the schema modules are written using [joi](https://github.com/hapijs/joi). These modules define what is a valid output for a given integration file as well as inputs for the config file.

### Integrations

### Overview

Integrations refer to plugins and features in different editors and tools that make MapRules presets and validation rules usable.

Currently supported integrations and integrations in development are below...

### JOSM

- the JOSM [MapRules Plugin](https://github.com/radiant-maxar/maprules-josm) provides support for MapRules in JOSM

STATUS: Developed and awaiting integration into the [JOSM Plugins](https://github.com/openstreetmap/josm-plugins) repo

### iD

- a feature branch brings MapRules support to iD

STATUS: Still just a [fork](https://github.com/radiant-maxar/iD/tree/remote-presets)
