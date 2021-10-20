// features/support/steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert").strict;
var shell = require('shelljs');
var config = require('./config');
var sleep = require('sleep');

Given('aws profile {word}', function (profile) {
    this.setProfile(profile);
});

Given('region {word}', function (region) {
    this.setRegion(region);
});

When('{word} connects to {word} on port {int} with timeout {int} seconds', function (instanceIds, host2, port, timeoutSeconds) {
    try {
        let region = config.ssm.ssm_default_region;
        if (this.region != null && this.region.trim().length > 0) {
            region = this.region;
        }
        var command = `aws ssm send-command \
            --document-name "AWS-RunRemoteScript" \
            --instance-ids "${instanceIds}" \
            --parameters '{"sourceType":["GitHub"],"sourceInfo":["{\\"owner\\":\\"ministryofjustice\\", \\"repository\\":\\"modernisation-platform-infrastructure-test\\", \\"getOptions\\": \\"branch:main\\", \\"path\\": \\"util\\"}"],"commandLine":["port-is-open.sh ${host2} ${port} ${timeoutSeconds}"]}' \
            --query "Command.CommandId" \
            --output text \
            --profile ${this.profile} \
            --region ${region}`;
        var result = shell.exec(command, {silent:true}); // result.stdout, result.code
        var commandId = result.stdout.split('\n')[0]; // remove the leading new line
        command = `aws ssm list-command-invocations \
            --command-id "${commandId}" \
            --details \
            --query "CommandInvocations[*].CommandPlugins[*].Status" \
            --output text \
            --profile ${this.profile} \
            --region ${region} \
            --no-cli-pager`;
        let count = 0;
        // Wait for the command to complete, until Status is Success or Failed
        do {
            var result = shell.exec(command, {silent:true});
            sleep.sleep(timeoutSeconds);
            count++;
        } while (count < 5 && (result == null || !(result.stdout.includes('Success') || result.stdout.includes('Failed'))));
        // Gather stdout
        command = `aws ssm list-command-invocations \
            --command-id "${commandId}" \
            --details \
            --query "CommandInvocations[*].CommandPlugins[*].Output[]" \
            --output text \
            --profile ${this.profile} \
            --region ${region} \
            --no-cli-pager`;
        var result = shell.exec(command, {silent:true}).stdout;
        var maxLength = 1000;
        var trimmed = result.length > maxLength ?
                            result.substring(0, maxLength - 3) + "..." :
                            result;
        this.setResponse(trimmed);
    } catch (error) {
        console.log(error);
    }
});

function responseIsNotBlank(response) {
    if (response == null || response.trim().length < 1) {
        assert.fail('Response was blank. Check previous output for errors. This could need dev debugging as one of the `aws ssm` commands might have failed.');
    }
}

Then('connection is successful', function () {
    responseIsNotBlank(this.response);
    assert.doesNotMatch(this.response, /ERROR/);
    assert.doesNotMatch(this.response, /failed to run command/);
    assert.doesNotMatch(this.response, /Connection timed out after/);
});

Then('connection is unsuccessful', function () {
    responseIsNotBlank(this.response);
    if (this.response.includes('ERROR')) {
        assert.match(this.response, /ERROR/);
    } else if(this.response.includes('failed to run command')) {
        assert.match(this.response, /failed to run command/);
    } else {
        assert.match(this.response, /Connection timed out after/);
    }
});
