## MapRules Configuration Schema Specification
### Example Config
```
{
    "name": "Public Health Campaign",
    "presets": [
        {
            "fields": [
                {
                    "keyCondition": 1,
                    "key": "opening_hours",
                    "label": "Hours of Operation",
		            "placeholder": "24/7",
                    "values": [
                        {
                            "valCondition": 2,
                            "values": [ "24/7", "sunrise_sunset" ]
                        }
                    ]
                },
                {
                    "keyCondition": 1,
                    "key": "height",
                    "values": [
                        {
                            "valCondition": 5,
                            "values": ["0"]
                        }
                    ]
                }
                {
                    "keyCondition": 1,
                    "key": "name",
                    "values": []
                }
            ],
            "geometry": ["point", "area"],
            "name": "Water Tap",
            "primary": [
                { 
                    "key": "amenity", 
                    "val": "drinking_water" 
                },
                { 
                    "key": "man_made", 
                    "val": "water_tap" 
                }
            ]
        }
    ],
    "disabledFeatures": [
        { 
            "key": "amenity", 
            "val": ["school", "clinic"] 
        }
    ]
}
```
<br/>
### Config schema
```
{
    "project": "Public Health Campaign",
    "presets": [{...}, {...}],
    "disabledFeatures": [{ "key": "amenity", "val": ["school", "clinic"] }]
}
```

|        key       | value  | description                                                    |
|:----------------:|--------|----------------------------------------------------------------|
|       name       | String | MapRules project name.                                         |
|      presets     | Array  | Array of MapRules preset/validation rule configuration objects |
| disabledFeatures | Array  | Array of disabled tags (tags not to be mapped)                 |
<br/>
### Disabled Features schema
```
"disabledFeatures": [
    { 
        "key": "amenity", 
        "val": ["school", "clinic"] 
    }
]
```
|  key  | value  | description                   |
|:-----:|--------|-------------------------------|
|  key  | String | Tag key not to be mapped      |
|  val  | Array  | Values not to mapped with key |

### Primary Tags schema
```
"primary": [
    {
        "key": "amenity", 
        "val": "drinking_water"
    },
    {
        "key": "man_made", 
        "val": "water_tap"
    }
]
```

|  key  | value  | description       |
|:-----:|--------|-------------------|
|  key  | String | primary tag key   |
|  val  | String | primary tag value |

### Preset schema
```
{
    "fields": [{...},{...}],
    "geometry": ["point"],
    "name": "Water Tap",
    "primary": [
        { "key": "amenity", "val": "drinking_water" },
        { "key": "man_made", "val": "water_tap" }
    ]
}
```

|    key   | value  | description                                                                |
|:--------:|--------|----------------------------------------------------------------------------|
|  fields  | Array  | Array of MapRules preset fields/validaiton selector configuration objects. |
| geometry | Array  | Array of OSM types                                                         |
|   name   | String | Preset name                                                                |
|  primary | Array  | MapRules preset/validation rule's primary keys (keys always on a feature)  |
<br/>

```
["area", "point"]
```

### OSM Type schema
| Geometry Type | value  | description                                          |
|:-------------:|--------|------------------------------------------------------|
|     point     | String | geometry interpretable as osm node                   |
|      line     | String | geometry interpretable as osm way (open or closed)   |
|      area     | String | geometry interpretable as osm closed-way w/area tags |
<br/>

### Field schema
```
{
    "keyCondition": 1,
    "key": "opening_hours",
    "label": "Hours of Operation",
    "placeholder": "24/7, sunset to sunrise, Mo-Su...",
    "values": [
        {
            "valCondition": 2,
            "values: [ "24/7", "sunrise_sunset" ]
        }
    ]

}
```

|      key     | value  | description                                           |
|:------------:|--------|-------------------------------------------------------|
| keyCondition | Number | Numeric representation of validation key condition    |
|      key     | String | Field key                                             |
|     label    | String | Label for user interface                              |
|  placeholder | String | Placeholder for user interface input                  |
|    values    | Array  | field values that drive preset & validation selectors |
<br/>
### Values schema
|       key       | value  | description                                                                  |
|:---------------:|--------|------------------------------------------------------------------------------|
|   valCondition  | Number | Numeric representation of validation value condition                         |
|      values     | Array  | Array of values relevant to value condition                                  |
| suggestedValues | Array  | Optional array used to suggest values when 'must be' value condition present |

### Key Condition schema
| value | description                                                             | validation type |
|:-----:|-------------------------------------------------------------------------|:---------------:|
|   0   | A feature **must not** have this key. When key present, throw an error. |      error      |
|   1   | A feature ***must** have this key. When key absent, throw error.        |      error      |
|   2   | A feature **may** have, but is not required to have, this key.          |     warning     |
<br/>
### Value Condition schema 

| value | description                                                             | validation type |
|:-----:|-------------------------------------------------------------------------|:---------------:|
|   0   | A tag value **must not** be a value in the values array                 |      error      |
|   1   | A tag value **must** be a value in the values array                     |      error      |
|   2   | A tag value **may** be a value in the values array                      |     warning     |
|   3   | A tag value **must** be less than the validation maximum                |      error      |
|   4   | A tag value **must** be less than or equal to the validation maximum    |      error      |
|   5   | A tag value **must** be greater than the validation minimum             |      error      |
|   6   | A tag value **must** be greater than or equal to the validation minimum |      error      |
