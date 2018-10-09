/**
 * @api {get} /config/:id Get MapRules config
 * @apiName GetConfig
 * @apiGroup Config
 * 
 * @apiParam {String} id MapRules configuration id
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *      curl http://localhost:3000/config/f343b37a-a2f5-4ee7-bcfd-2710af86c6ba
 * 
 * @apiSuccessExample {json} Success-Response
 *  {
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
                    },
                    {
                        "keyCondition": 1,
                        "key": "name",
                        "values": []
                    }
                ],
                "geometry": ["node", "area"],
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
 *  }
 * @apiErrorExample {json} Error-Response: id not in the database
 *      {
 *          "statusCode":404,
 *          "error":"Not Found",
 *          "message":"Not Found"
 *      }
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *      {
 * 	    "statusCode":400,
 * 	    "error":"Bad Request",
 * 	    "message":"Invalid request params input"
 * 	}
 * 
 */

/**
 * @api {post} /config Post MapRules config
 * @apiName PostConfig
 * @apiGroup Config
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *      curl -H "Content-Type: application/json" -X POST -d '{"name":"Public Health Campaign","presets":[{"fields":[{"keyCondition":"1","key":"opening_hours","label":"Hours of Operation","placeholder":"24/7","values":[{"valCondition":2,"values":["24/7","sunrise_sunset"]}]},{"keyCondition":1,"key":"height","values":[{"valCondition":5,"values":["0"]}]},{"keyCondition":1,"key":"name","values":[]}],"geometry":["node","area"],"name":"Water Tap","primary":[{"key":"amenity","val":"drinking_water"},{"key":"man_made","val":"water_tap"}]}],"disabledFeatures":[{"key":"amenity","val":["school","clinic"]}]}'
 * 
 * @apiSuccessExample {json} Success-Response
 *      {"upload":"successful","id":"a1035b4b-2580-4dfa-bf42-9ffb94d1690d"}
 * 
 * @apiErrorExample {json} Error-Response: payload does not match MapRules config schema 
 *      {"statusCode":400,"error":"Bad Request","message":'child "presets" fails because ["presets" at position 0 fails because [child "fields" fails because ["fields" at position 1 fails because [child "keyCondition" fails because ["keyCondition" less than or equal to 6]]]]]'}
 */

/**
 * @api {put} /config/:id Put updated MapRules config
 * @apiName PuttConfig
 * @apiGroup Config
 * 
 * @apiParam {String} id MapRules configuration id
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *       curl -H "Content-Type: application/json" -X PUT -d 'Content-Type: application/json" -X POST -d '{"project":"Public Health Campaign","presets":[{"fields":[{"keyCondition":1,"key":"opening_hours","label":"Hours of Operation","placeholder":"24/7, sunrise to sunset...","values":{"suggested":[{"val":"24/7","name":"always open"},{"val":"sunrise to sunset"}]}},{"keyCondition":1,"key":"height","values":{"numeric":{"greaterThan":2}}},{"keyCondition":1,"key":"name","values":{}}],"geometry":["node"],"name":"Water Tap","primary":[{"key":"amenity","val":"drinking_water"},{"key":"man_made","val":"water_tap"}]}],"disabledFeatures":[{"key":"amenity","val":"school"}]}' http://localhost:3000/config/a1035b4b-2580-4dfa-bf42-9ffb94d1690d 
 * 
 * @apiSuccessExample {json} Success-Response
 *      {"update":"successful"}
 * 
 * @apiErrorExample {json} Error-Response: payload does not match MapRules config schema 
 *      {"statusCode":400,"error":"Bad Request","message":'child "project" fails because ["project" is required]'}
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *      {"statusCode":400,"error":"Bad Request","message":'child "id" fails because ["id" must be a valid GUID]'}
 * 
 */

/**
 * @api {get} /config/:id/rules/JOSM Get MapCSS rules for a given MapRules config
 * @apiName GetJOSMRules
 * @apiGroup JOSM
 * 
 * @apiParam {String} id MapRules configuration id
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *      curl http://localhost:3000/config/72d5df88-c53a-458b-8247-8e691feb0d04/rules/JOSM
 * 
 * @apiSuccessExample {text} Success-Response
 * 
 *  node[amenity=drinking_water][man_made=water_tap][!opening_hours]{
        throwError: "'Water Tap' preset must include opening_hours";
    }
    node[amenity=drinking_water][man_made=water_tap][opening_hours][opening_hours!~/^24\/7$|^sunrise_sunset$/]{
        throwError: "opening_hours may be '24/7','sunrise_sunset'";
    }
    node[amenity=drinking_water][man_made=water_tap][!height]{
        throwError: "'Water Tap' preset must include height";
    }
    node[amenity=drinking_water][man_made=water_tap][height][height > 0]{
        throwError: "height must be greater than 0";
    }
    node[amenity=drinking_water][man_made=water_tap][!name]{
        throwError: "'Water Tap' preset must include name";
    }
    way[amenity=drinking_water][man_made=water_tap][!opening_hours]:closed{
        throwError: "'Water Tap' preset must include opening_hours";
    }
    way[amenity=drinking_water][man_made=water_tap][opening_hours][opening_hours!~/^24\/7$|^sunrise_sunset$/]:closed{
        throwError: "opening_hours may be '24/7','sunrise_sunset'";
    }
    way[amenity=drinking_water][man_made=water_tap][!height]:closed{
        throwError: "'Water Tap' preset must include height";
    }
    way[amenity=drinking_water][man_made=water_tap][height][height > 0]:closed{
        throwError: "height must be greater than 0";
    }
    way[amenity=drinking_water][man_made=water_tap][!name]:closed{
        throwError: "'Water Tap' preset must include name";
    }
    node[amenity][amenity=~/^school$|^clinic$/]{
        throwError: "amenity cannot be coupled with 'school','clinic'";
    }
    way[amenity][amenity=~/^school$|^clinic$/]{
        throwError: "amenity cannot be coupled with 'school','clinic'";
 *  }    
 * 
 * @apiErrorExample {json} Error-Response: id not in the database
 *      {"statusCode":404,"error":"Not Found","message":"Not Found"}
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *      {"statusCode":400,"error":"Bad Request","message":"Invalid request params input"}
 * 
 */

/**
 * @api {get} /config/:id/presets/JOSM Get JOSM preset xml for given MapRules config
 * @apiName GetJOSMPresets
 * @apiGroup JOSM
 * 
 * @apiParam {String} id MapRules configuration id
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *      curl http://localhost:3000/config/72d5df88-c53a-458b-8247-8e691feb0d04/presets/JOSM
 * 
 * @apiSuccessExample {xml} Success-Response
 *
 *  <preset>
        <group name="Public Health Campaign" icon="images/dialogs/edit.png">
            <item name="Health Clinic" type="closedway,node" icon="images/layer/osmdata_small.png">
                <key key="amenity" value="clinic"/>
                <key key="area" value="yes"/>
            </item>
            <item name="Market" type="closedway" icon="images/layer/osmdata_small.png">
                <key key="amenity" value="marketplace"/>
                <key key="area" value="yes"/>
                <combo key="source" text="source" values_searchable="true">
                    <list_entry value="bing" display_value="Bing"/>
                    <list_entry value="dg" display_value="Dg"/>
                </combo>
                <combo key="opening_hours" text="Opening Hours" values_searchable="true">
                    <list_entry value="24/7" display_value="24/7"/>
                    <list_entry value="sunrise to sunset" display_value="Sunrise to Sunset"/>
                </combo>
                <text key="building" text="Building"/>
                <text key="height" text="Height"/>
            </item>
            <item name="Water Tap" type="node" icon="images/layer/osmdata_small.png">
                <key key="amenity" value="drinking_water"/>
                <key key="man_made" value="water_tap"/>
            </item>
        </group>
 *  </preset>
 *
 * @apiErrorExample {json} Error-Response: id not in the database
 *      {"statusCode":404,"error":"Not Found","message":"Not Found"}
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *      {"statusCode":400,"error":"Bad Request","message":"Invalid request params input"}
 * 
 */

/**
 * @api {get} /config/:id/rules/iD Get json equivalent MapCSS rules for a given MapRules config
 * @apiName GetiDRules
 * @apiGroup iD
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *     curl http://localhost:3000/config/72d5df88-c53a-458b-8247-8e691feb0d04/rules/iD
 * 
 * @apiSuccessExample {json} Success-Response
 * 
 *  [
        {
            geometry: "node",
            equals: {
                man_made: "water_tap"
            },
            absence: "opening_hours",
            error: "'Water Tap' preset must include opening_hours"
        },
        {
            geometry: "node",
            equals: {
                man_made: "water_tap"
            },
            presence: "opening_hours",
            negativeRegex: {
                opening_hours: [
                    "^24\/7$",
                    "^sunrise_sunset$"
                ]
            },
            error: opening_hours may be '24/7','sunrise_sunset'"
        },
        {
            geometry: "node",
            equals: {
                man_made: "water_tap"
            },
            absence: "height",
            error: "'Water Tap' preset must include height"
        },
        {
            geometry: "node",
            equals: {
                man_made: "water_tap"
            },
            presence: "height",
            greaterThan: {
                height: 0
            },
            error: "height must be greater than 0"
        },
        {
            geometry: "node",
            equals: {
                man_made: "water_tap"
            },
            absence: "name",
            error: "'Water Tap' preset must include name"
        },
        {
            geometry: "closedway",
            equals: {
                man_made: "water_tap"
            },
            absence: "opening_hours",
            error: "'Water Tap' preset must include opening_hours"
        },
        {
            geometry: "closedway",
            equals: {
                man_made: "water_tap"
            },
            presence: "opening_hours",
            negativeRegex: {
                opening_hours: [
                    "^24\/7$",
                    "^sunrise_sunset$"
                ]
            },
            error: "opening_hours may be '24/7','sunrise_sunset'"
        },
        {
            geometry: "closedway",
            equals: {
                man_made: "water_tap"
            },
            absence: "height",
            error: "'Water Tap' preset must include height"
        },
        {
            geometry: "closedway",
            equals: {
                man_made: "water_tap"
            },
            presence: "height",
            greaterThan: {
                height: 0
            },
            error: height must be greater than 0"
        },
        {
            geometry: "closedway",
            equals: {
                man_made: "water_tap"
            },
            absence: "name",
            error: 'Water Tap' preset must include name"
        },
        {
            geometry: "node",
            presence: "amenity",
                positiveRegex: {
                    amenity: [
                        "^school$",
                        "^clinic$"
                    ]
                },
            error: "amenity cannot be coupled with 'school','clinic'"
        },
        {
            geometry: "way",
            presence: "amenity",
            positiveRegex: {
                amenity: [
                    "^school$",
                    "^clinic$"
                ]
            },
            error: "amenity cannot be coupled with 'school','clinic'"
        }
 *  ]
 * 
 * @apiErrorExample {json} Error-Response: id not in the database
 *     {"statusCode":404,"error":"Not Found","message":"Not Found"}
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *     {"statusCode":400,"error":"Bad Request","message":"Invalid request params input"}
 * 
 */

/**
 * @api {get} /config/:id/presets/iD Get iD Presets for a given MapRules Config
 * @apiName GetiDPresets
 * @apiGroup iD
 * 
 * @apiVersion 0.0.1
 * 
 * @apiExample {curl} Example Usage
 *     curl http://localhost:3000/config/72d5df88-c53a-458b-8247-8e691feb0d04/presets/iD
 * 
 *  {
        categories: {
            category-point: {
                icon: "maki-natural",
                geometry: "point",
                name: "MapRules point Features",
                members: [
                    "b116289d-912c-47ce-a89d-77ced4494df5"
                ]
            },
            category-area: {
                icon: "maki-natural",
                geometry: "area",
                name: "MapRules area Features",
                members: [
                    "b116289d-912c-47ce-a89d-77ced4494df5"
                ]
            }
        },
        presets: {
            b116289d-912c-47ce-a89d-77ced4494df5: {
                geometry: [
                    "point",
                    "area"
                ],
                tags: {
                    amenity: "drinking_water",
                    man_made: "water_tap"
                },
                icon: "maki-natural",
                name: "Water Tap",
                fields: [
                    "83ed0731-cb9e-408b-82b0-d37adab90289",
                    "bd9b78fd-4338-49aa-81ce-cc2f2060f3ea",
                    "e5a6e023-9638-4e80-8be9-a707d892fc39"
                ]
            },
            point: {
                fields: [
                    "name"
                ],
                geometry: [
                    "point"
                ],
                tags: { },
                name: "Point",
                matchScore: 0.1
            },
            line: {
                fields: [
                    "name"
                ],
                geometry: [
                    "line"
                ],
                tags: { },
                name: "Line",
                matchScore: 0.1
            },
            area: {
                fields: [
                    "name"
                ],
                geometry: [
                    "area"
                ],
                tags: {
                    area: "yes"
                },
                name: "Area",
                matchScore: 0.1
            },
            relation: {
                icon: "iD-relation",
                fields: [
                    "name",
                    "relation"
                ],
                geometry: [
                    "relation"
                ],
                tags: { },
                name: "Relation"
            }
        },
        fields: {
            83ed0731-cb9e-408b-82b0-d37adab90289: {
                key: "opening_hours",
                label: "Hours Of Operation",
                overrideLabel: "Hours Of Operation",
                placeholder: "24/7",
                strings: {
                    options: {
                        24/7: "24/7",
                        Sunrise Sunset: "sunrise_sunset"
                    }
                },
                type: "combo"
            },
            bd9b78fd-4338-49aa-81ce-cc2f2060f3ea: {
                key: "height",
                label: "Height",
                overrideLabel: "Height",
                placeholder: "...",
                maxValue: 0,
                type: "number"
            },
            e5a6e023-9638-4e80-8be9-a707d892fc39: {
                key: "name",
                label: "Name",
                overrideLabel: "Name",
                placeholder: "...",
                type: "text"
            },
            name: {
                key: "name",
                type: "localized",
                label: "Name",
                universal: true,
                placeholder: "Common name (if any)"
            },
            relation: {
                key: "type",
                type: "combo",
                label: "Type"
            },
            comment: {
                key: "comment",
                type: "textarea",
                label: "Changeset Comment",
                placeholder: "Brief description of your contributions (required)"
            },
            source: {
                key: "source",
                type: "semiCombo",
                icon: "source",
                universal: true,
                label: "Sources",
                snake_case: false,
                caseSensitive: true,
                options: [
                    "survey",
                    "local knowledge",
                    "gps",
                    "aerial imagery",
                    "streetlevel imagery"
                ]
            },
            hashtags: {
                key: "hashtags",
                type: "semiCombo",
                label: "Suggested Hashtags",
                placeholder: "#example"
            }
        },
        defaults: {
            point: [
                "b116289d-912c-47ce-a89d-77ced4494df5"
            ],
           area: [
               "b116289d-912c-47ce-a89d-77ced4494df5"
           ]
        }
 *  }
 * 
 * @apiErrorExample {json} Error-Response: id not in the database
 *     {"statusCode":404,"error":"Not Found","message":"Not Found"}
 * 
 * 
 * @apiErrorExample {json} Error-Response: id parameter does not match uuid v4 schema
 *     {"statusCode":400,"error":"Bad Request","message":"Invalid request params input"}
 * 
 */

/**
 * @api {docs} /spec MapRules configuration specification
 * @apiName DocsSpec
 * @apiGroup Docs
 * @apiVersion 0.1.0
 */

/**
  * @api {docs} /rules MapRules validation rule scenarios
  * @apiName DocsRules
  * @apiGroup Docs
  * @apiVersion 0.1.0
  */
