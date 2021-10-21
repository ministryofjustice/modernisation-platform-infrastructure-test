Feature: Modernisation Platform's performance-hub development
  environment is isolated from other environments but allows
  access to hosts within the environment.

  Background:
    Given aws profile performance-hub-development
    And region eu-west-2

  Scenario: bastion host can access performance-hub-db-mgmt-server within the development
  environment
    When i-0082c018b2e4b02be connects to 10.234.32.219 on port 3389 with timeout 2 seconds
    Then connection is successful

  Scenario: development bastion CANNOT access the production bastion
    When i-0082c018b2e4b02be connects to 10.237.24.240 on port 22 with timeout 2 seconds
    Then connection is unsuccessful
