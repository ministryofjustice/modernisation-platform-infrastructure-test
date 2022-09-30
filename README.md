# Modernisation Platform infrastructure test tool based on Cucumber.js

[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=for-the-badge&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fmodernisation-platform-infrastructure-test)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#modernisation-platform-infrastructure-test "Link to report")

## Prerequisites

Before running the features for the first time, add required dependencies

```
npm install --save-dev @cucumber/cucumber
npm install shelljs
npm install sleep
```

Configure AWS profiles in `~/.aws/config`, for example

```
[default]
region = eu-west-2

[profile mod-root]
mfa_serial = arn:aws:iam::123456789991:mfa/george-f-admin
credential_process = aws-vault exec mod-root --json --prompt=osascript

[profile sprinkler-development]
source_profile=mod-root
role_arn=arn:aws:iam::123456789992:role/ModernisationPlatformAccess
mfa_serial=arn:aws:iam::123456789991:mfa/george-f-admin
role_session_name=george-f-admin
```

## Usage

Run features

    ./node_modules/.bin/cucumber-js

## References

1. https://github.com/cucumber/cucumber-js
2. [Running specific features](https://github.com/cucumber/cucumber-js/blob/main/docs/cli.md#running-specific-features)
3. https://cucumber.io/docs/gherkin/reference/
4. https://github.com/cucumber/cucumber-expressions/
5. https://nodejs.org/api/assert.html
6. [Accessing EC2s using bastions](https://user-guide.modernisation-platform.service.justice.gov.uk/user-guide/accessing-ec2s.html#accessing-ec2s-using-bastions)
7. [Avoiding too much security](https://security-guidance.service.justice.gov.uk/setecastronomy/#not-all-domain-names-or-ip-addresses-in-government-systems-are-sensitive-items)
