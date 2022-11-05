const { Construct } = require("constructs");
const lambda = require("aws-cdk-lib/aws-lambda");
const lambdaNode = require("aws-cdk-lib/aws-lambda-nodejs");
const { SigningProfile, Platform } = require("aws-cdk-lib/aws-signer");
const cloudwatch = require("aws-cdk-lib/aws-cloudwatch");
const codedeploy = require("aws-cdk-lib/aws-codedeploy");
const { Duration } = require("aws-cdk-lib");
const ssm = require("aws-cdk-lib/aws-ssm");
const path = require("path");
const apigateway = require("aws-cdk-lib/aws-apigateway");

/** Class representing a Lambda Service with deployment
 * Options, metrics and bestpractices. */
class LambdaService extends Construct {
  constructor(scope, id, lambdaProperties, projectProps) {
    super(scope, id);
    // Create signer profile
    const signingProfile = new SigningProfile(
      this,
      lambdaProperties["function_name"].concat("SigningProfile"),
      {
        platform: Platform.AWS_LAMBDA_SHA384_ECDSA,
      }
    );

    const codeSigningConfig = new lambda.CodeSigningConfig(
      this,
      lambdaProperties["function_name"].concat("CodeSigningConfig"),
      {
        signingProfiles: [signingProfile],
      }
    );

    // Define lambda function
    const runtime = {
      "3.8": lambda.Runtime.PYTHON_3_8,
      "3.9": lambda.Runtime.PYTHON_3_9,
    };

    const func = new lambda.Function(this, lambdaProperties["function_name"],
    {
      codeSigningConfig,
      functionName: lambdaProperties["function_name"],
      runtime: runtime[lambdaProperties["runtime"]],
      handler: "main.lambda_handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../function')),
      timeout: Duration.seconds(lambdaProperties["timeout"]),
      environment: lambdaProperties["environment_vars"],
    })

    // Create alarms
    if (func.timeout) {
      new cloudwatch.Alarm(
        this,
        lambdaProperties["function_name"].concat("TimeOutAlarm"),
        {
          metric: func.metricDuration().with({
            statistic: "Maximum",
          }),
          evaluationPeriods: 1,
          datapointsToAlarm: 1,
          threshold: func.timeout.toMilliseconds(),
          treatMissingData: cloudwatch.TreatMissingData.IGNORE,
          alarmName: lambdaProperties["function_name"].concat("_TimeOutAlarm"),
        }
      );
    }

    const errorAlarm = new cloudwatch.Alarm(
      this,
      lambdaProperties["function_name"].concat("Errors"),
      {
        alarmName: lambdaProperties["function_name"].concat("_Errors"),
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        threshold: 1,
        evaluationPeriods: 1,
        metric: func.metricErrors(),
      }
    );

    // Define deployment configuration
    const application = new codedeploy.LambdaApplication(
      this,
      "CodeDeployApplication",
      {
        applicationName: lambdaProperties["function_name"], // optional property
      }
    );
    const deploymentConfig = {
      linear101:
        codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
      allOnce: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
    };
    const deploymentGroup = new codedeploy.LambdaDeploymentGroup(
      this,
      lambdaProperties["deployment_config"].concat("Deployment"),
      {
        application: application, // optional property: one will be created for you if not provided
        alias: func.currentVersion,
        deploymentConfig:
          deploymentConfig[lambdaProperties["deployment_config"]],
        alarms: [
          // pass some alarms when constructing the deployment group
          errorAlarm,
        ],
      }
    );

    this.api = new apigateway.LambdaRestApi(
      this,
      lambdaProperties["function_name"].concat("Api"),
      {
        handler: func,
        proxy: true,
        deployOptions: {
          stageName: "test",
          dataTraceEnabled: false,
          tracingEnabled: false,
          //accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
          //accessLogFormat: apigateway.AccessLogFormat.clf(),
        },
        binaryMediaTypes: ["multipart/form-data", "image/*"],
      }
    );
  }
}

module.exports = { LambdaService };
