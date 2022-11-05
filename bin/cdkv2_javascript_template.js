#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { Cdkv2JavascriptTemplateStack } = require('../lib/cdkv2_javascript_template-stack');
const props = require("../project_configs/project_config");
const helper = require("../project_configs/helper");


const app = new cdk.App();
const serviceStack= new Cdkv2JavascriptTemplateStack(app,  props["project_name"].concat('Stack'), props,  { 
  env: {account: props['account'], region: props['region'] 
} 
});


 helper.setTags(serviceStack, props["tags"]);
