Feature: Modernisation Platform's performance-hub preproduction
  environment is isolated from other environments but allows
  access to hosts within the environment.

  Background:
    Given aws profile performance-hub-preproduction
    And region eu-west-2

  Scenario: bastion host can access performance-hub-db-mgmt-server within the preproduction
  environment
    When i-0a07864f770ed6bfc connects to 10.236.0.68 on port 3389 with timeout 2 seconds
    Then connection is successful

  Scenario: preproduction bastion CANNOT access the production bastion
    When i-0a07864f770ed6bfc connects to 10.237.24.240 on port 22 with timeout 2 seconds
    Then connection is unsuccessful
