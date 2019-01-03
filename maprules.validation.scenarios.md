# MapRules validations

## Synopsis

MapRules validations are rules used to make sure OSM features' match some specification of 'valid' tags.' A set of validations are effectively synonymous with a tagging schema. There are two kinds of MapRules validations, 'errors' and 'warnings'.<br>

### Errors

When a feature's tags break an error validation, that feature's tags are considered invalid. Thus, to upload that feature to OpenStreetMap is to upload a feature invalid per the MapRules validations.<br>

### Warnings

When a feature's tags break a warning validation, that feature's tags are not considered invalid, but rather incomplete. Thus, to upload that feature to OpenStreetMap is to upload an incomplete feature per the MapRules Validation.

Please note, features that are not valid per MapRules Validations are still absolutely valid to upload to OpenStreetMap. Moreover, Validation rules are context specific, meaning two different sets of MapRules validation rules may interpret the same collection of OSM features very differently.<br>

## Understanding Validation conditions

Validation conditions are what determine if a validation throws an error, causes a warning, or interprets a feature to be valid.

Note, these conditions are only applied to features that meet a validation's primary tags & geometry conditions. As an illustration, if a validation is intended for closedway features tagged `barrier=fence`, conditions would not apply to line features tagged `barrier=wall`.

Like validations, there are 2 kinds of conditionals, key conditions and value conditions.<br>

### Key conditions

Key conditions are concerned with an OSM feature tag keys. When a key does not pass a key condition, that validation is broken.

There are three key conditions...<br>

#### **Must have**

Attributes                  | Description
--------------------------- | -----------------------------------------------------------------------------------------------------------------
Description                 | A feature must have the tag key in question.
Validation Type             | Error
Example                     | With a 'must have building key' validation, the absence of a building tag key on a feature breaks the validation.
keyCondition Representation | 1

<br>

#### **May have**

Attributes                  | Description
--------------------------- | --------------------------------------------------------------------------------------------------------------
Description                 | A feature may have the tag key in question.
Validation Type             | Warning
Example                     | With a 'may be building key' validation, the absence of a building tag key on a feature breaks the validation.
keyCondition representation | 2

<br>

#### **Must Not have**

Attributes                  | Description
--------------------------- | ---------------------------------------------------------------------------------------------------------------------
Description                 | A feature must not have the tag key in question.
Validation Type             | Error
Example                     | With a 'must not have building key validation, the presence of a building tag key on a feature breaks the validation.
keyCondition Representation | 0

<br>

#### **Value conditions**

Value conditions are concerned with OSM feature tag values. When a tag value does not pass a value condition, that validation is broken.

There six value conditions...<br>

#### **Must be**

Attributes                  | Description
--------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
Validation Type             | Error
Example                     | With an 'amenity must be 'clinic' or 'school' value condition, a feature tagged 'amenity=drinking_water' breaks the validation; 'amenity=school' passes the validation.
valCondition representation | 1

<br>

#### **May be**

Attributes                  | Description
--------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
Description                 | A feature may have a tag value that is equal to the valid value or one of the valid values.
Validation Type             | Warning
Example                     | With an 'amenity must be 'clinic' or 'school' value condition, a feature tagged 'amenity=drinking_water' breaks the validation; 'amenity=school' passes the validation.
valCondition Representation | 2

<br>

#### **Must not be**

Attributes                  | Description
--------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Description                 | A feature must not have a tag value that is equal to the valid value or one of valid values.
Validation Type             | Error
Example                     | With an 'amenity must not be 'clinic' or 'school' value condition, a feature tagged 'amenity=clinic' breaks the validation; 'amenity=drinking_water' passes the validation.
valCondition Representation | 0

<br>

#### **Must be less than**

Attributes                  | Description
--------------------------- | -----------------------------------------------------------------------------------------------------
Description                 | A feature must have a tag value less than the validation maximum.
Validation Type             | Error
Example                     | With a 'lanes must be less than 3' value condition, a feature tagged 'lanes=3' breaks the validation.
valCondition Representation | 3

<br>

#### **Must be less than or equal to**

Attributes                  | Description
--------------------------- | ---------------------------------------------------------------------------------------------------------------------
Description                 | A feature must have a tag value less than or equal to the validation maximum.
Validation Type             | Error
Example                     | With a 'lanes must be less than or equal to 3' value condition, a feature tagged wth 'lanes=4' breaks the validation.
valCondition Representation | 4

<br>

#### **Must be greater than**

Attributes                  | Description
--------------------------- | -----------------------------------------------------------------------------------------------------------
Description                 | A feature must have a tag value greater than the validation minimum.
Validation Type             | Error
Example                     | With 'lanes must be greater than 3' value condition, a feature tagged with 'lanes=3' breaks the validation.
valCondition Representation | 5

<br>

#### **Must be greater than or equal to**

Attributes                  | Description
--------------------------- | ------------------------------------------------------------------------------------------------------------------
Description                 | A feature must have a tag value that is greater than or equal to the validation minimum.
Validation Type             | Error
Example                     | With 'lanes must be greater than or equal to 3' value condition, a feature tagged 'lanes=2' breaks the validation.
valCondition Representation | 6

<br>

## Validation Scenarios

Combining key and value conditions generates many different validation scenarios. As a small illustration, if a MapRules Validation set includes a 'key must be building' key condition and 'value may be yes or residential'. A feature without a building tag would throw an error, and one with building=house would throw a warning.

Below are a set of tables to describe the different validation scenarios.<br>

### **Must not be**

|                   | Value Condition | Key Present |    Missing Key    |
|:-----------------:|:---------------:|:-----------:|:-----------------:|
| **Key Condition** |                 |             |                   |
|       0           |                 |    error    | passes validation |

<br>

### **Value Must Not be in values array**

|                   | Value Condition | Missing Key | Key Present & Values in values array | Key Present & Values not in values array |
|:-----------------:|:---------------:|:-----------:|:------------------------------------:|:----------------------------------------:|
| **Key Condition** |                 |             |                                      |                                          |
|       1           |                 |    error    |                 error                |             passes validation            |
|       2           |                 |   warning   |                 error                |             passes validation            |
<br>

### **Value Must be in values array**

|                   | Value Condition | Missing Key | Key Present & Values in values array | Key Present & Values not in values array |
|:-----------------:|:---------------:|:-----------:|:------------------------------------:|:----------------------------------------:|
| **Key Condition** |                 |             |                                      |                                          |
|         1         |                 |    error    |           passes validation          |                   error                  |
|         2         |                 |   warning   |           passes validation          |                   error                  |
<br>

### **Value May be in values array**

|                   | Value Condition | Missing Key | Key Present & Values in values array | Key Present & Values not in values array |
|:-----------------:|:---------------:|:-----------:|:------------------------------------:|:----------------------------------------:|
| **Key Condition** |                 |             |                                      |                                          |
|       1           |                 |    error    |           passes validation          |                  warning                 |
|       2           |                 |   warning   |           passes validation          |                  warning                 |
<br>

### **Value Must be less than maximum**

|                   | Value Condition | Missing Key | Key Present & Values less than maximum | Key Present & Value greater than or equal to maximum |
|:-----------------:|:---------------:|:-----------:|:--------------------------------------:|:----------------------------------------------------:|
| **Key Condition** |                 |             |                                        |                                                      |
|       1           |                 |    error    |            passes validation           |                         error                        |
|       2           |                 |   warning   |            passes validation           |                         error                        |
<br>

### **Value Must be less than or equal to maximum**

|                   | Value Condition | Missing Key | Key Present & Values less than or equal to maximum | Key Present & Value greater than maximum |
|:-----------------:|:---------------:|:-----------:|:--------------------------------------------------:|:----------------------------------------:|
| **Key Condition** |                 |             |                                                    |                                          |
|       1           |                 |    error    |                  passes validation                 |                   error                  |
|       2           |                 |   warning   |                  passes validation                 |                   error                  |
<br>

### **Value Must be greater than minimum**


|                   | Value Condition | Missing Key | Key Present & Values less than or equal to maximum | Key Present & Value greater than |
|:-----------------:|:---------------:|:-----------:|:--------------------------------------------------:|:--------------------------------:|
| **Key Condition** |                 |             |                                                    |                                  |
|       1           |                 |    error    |                        error                       |         passes validation        |
|       2           |                 |   warning   |                        error                       |         passes validation        |
<br>

### **Value Must be greater than or equal to minimum**


|                   | Value Condition | Missing Key | Key Present & Values less than maximum | Key Present & Value greater than or equal to |
|:-----------------:|:---------------:|:-----------:|:--------------------------------------:|:--------------------------------------------:|
| **Key Condition** |                 |             |                                        |                                              |
|       1           |                 |    error    |                  error                 |               passes validation              |
|       2           |                 |   warning   |                  error                 |               passes validation              |
