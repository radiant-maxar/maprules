# Contributing to MapRules

First off, thanks for considering to contribute! Before heading to file a ticket for a bug you found or an awesome idea, please read the [Code of Conduct](link.to.code.of.conduct).

# File an issue

Think you have an issue to file? Awesome, dd it! Whether it's a gnarly bug, new idea, or some other problem or concern, we'd love to here from you. 
Note, as the project grows, there may already be an issue addressing your issue. So be sure to check both the issues tab before hand.

When writing a ticket, make sure you include the following (as they apply)...

- [ ] Provide steps to replicate the error (i.e, I added this key and value condition, loaded up editor x. and problem y occurred)
- [ ] Share a related screenshot, or better yet a GIF! 
    - For GIFS, [LICEcap](https://www.cockos.com/licecap/) is a goto for windows users, [peek](https://github.com/phw/peek) rules for linux, and [kap](https://getkap.co/) is a nice looking option for mac
- [ ] If you can share a stack trace, please do so!

# Labelling your issue.

Adding an issue label helps keep MapRules development more organized and better direct contributors to work suitable for their interests and farmiliarity with the code base.


## Bugs :bug:

These labels are for issues needing fixing...

| type            | description                                                                  |
|-----------------|------------------------------------------------------------------------------|
| bug-maprules    | bug that applies directly to the MapRules service code                       |
| bug-integration | bug that applies to using MapRules in one of the tools it is integrated with |

## Actionables 

These labels are for issues to be handled

| type             | description                                                                                               |
|------------------|-----------------------------------------------------------------------------------------------------------|
| good first issue | issue for first time contributors                                                                         |
| help wanted      | a heftier task that requires some prior knowledge of or willingness to get to know the MapRules code base |

## features

These labels are for features to be added

| type             | description                                               |
|------------------|-----------------------------------------------------------|
| schema-migration | features that update the db schema                        |
| adapter          | features that add a new adapter                           |
| rule             | feature that adds a new rule type for MapRules to support |
| performance      | feature that makes MapRules more performant               |

## discussion

These labels should be applied to issues that encapsulate some general discussion

| type        | description                                                                                                                                  |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| question    | if it's not clear if a new feature should be in MapRules, or perhaps there lacks' clarity on how best to solve a problem, this label applies |
| considering | if an ask is interesting but more consensus is needed before it's all systems go, this label applies                                         |

## housekeeping

These labels should be applied to indicate what developers are doing to address or not address an issues

| type      | description                                                                                                 |
|-----------|-------------------------------------------------------------------------------------------------------------|
| wip       | an ask that is currently in progress. like dilla said, we're workinonit!                                    |
| duplicate | an ask that has already been brought up in a separate ticket                                                |
| waitfor   | an ask that one must wait for, most of the time because some other task needs to come before it is possible |
| wontfix   | an ask that cannot be added into MapRules when asked for.                                                   |

# Submitting a pull request

When adding a feature or fixing a bug, please make sure to follow the convention of matching branch number with the issue number.
For example...

1. I make an issue for osm-lint integration. it's issue #10
2. To update MapRules for said integration, I make a new branch off of `develop` called `10` to add that integration
3. I make a pull request for this back into the `develop` branch

Additionally, all prs that add new code not already covered by a test MUST include a new test in the `test` directory.
This is not just a good coding practice thing, it's a `get-your-ci-tests-to-pass` thing, seriously. CI tests require a threshold for code coverage. 
So, no matter how stupendous a new feature is (which we are thankful for), its branch will not 'pass test' if the new code it introduces is not thoroughly tested.

### Nice to have parts to your pr

- reference the issue you working on with each commit. like...

```
added initial work for josmPresets adapter

ref #10
```

- use the built in GitHub closes keyword so we close issues when we merge prs

```
closes #10
```

- give steps to test if applicable

```
1. spin up maprules with fixture data
2. curl `${link.to.maprules}/config/${uuid}/osmlint` osmlint conf
3. run the osmlint command `${some.osmlint.command} --confpath ${path.to.conf.you.downloaded}
4. see expected osmlint output.
```