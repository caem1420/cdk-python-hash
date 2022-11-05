const { Stack } = require("aws-cdk-lib");
const { LambdaService } = require("./constructs/lambda-service");

/** Class representing a Stack for serverless lambda. */
class Cdkv2JavascriptTemplateStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {projectProps=} projectProps
   * @param {StackProps=} props
   */
  constructor(scope, id, projectProps, props) {
    super(scope, id, props);

    const service = new LambdaService(
      this,
      projectProps["project_name"],
      projectProps["lambda_parameters"],
      projectProps
    );

    // Custom method for lambda proxy integration
  }
}

module.exports = { Cdkv2JavascriptTemplateStack };
