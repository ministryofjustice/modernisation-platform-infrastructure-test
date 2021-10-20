Feature: Modernisation Platform's Sprinkler development environment
    is isolated from other environments but allows access to hosts
    within the environment.

    Background:
        Given aws profile sprinkler-development
        And region eu-west-2

    Scenario: bastion host can access private-host-test within the development
    environment
        When i-0bec458ec2fce8daf connects to 10.234.0.186 on port 80 with timeout 2 seconds
        Then connection is successful

    Scenario: development bastion CANNOT access the production bastion
        When i-0bec458ec2fce8daf connects to 10.237.0.90 on port 80 with timeout 2 seconds
        Then connection is unsuccessful
