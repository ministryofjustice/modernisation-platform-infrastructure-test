var config = {};

config.ssm = {};

config.ssm.ssm_default_region = process.env.SSM_DEFAULT_REGION || 'eu-west-2';

module.exports = config;
