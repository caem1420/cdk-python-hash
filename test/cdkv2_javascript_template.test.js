const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const {
  Cdkv2JavascriptTemplateStack,
} = require("../lib/cdkv2_javascript_template-stack");
const props = require("../project_configs/project_config");

test("Verify the stack to have the resources", () => {
  const app = new cdk.App();
  const stack = new Cdkv2JavascriptTemplateStack(
    app,
    props["project_name"].concat("Stack"),
    props
  );
  const templated = Template.fromStack(stack);

  templated.hasResourceProperties("AWS::Lambda::Function", {
    Runtime: "nodejs12.x",
    TracingConfig: {
      Mode: "Active",
    }
  });
});
