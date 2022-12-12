import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {join} from "path";
import config from "../../config/config";
import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Resource} from "aws-cdk-lib/aws-apigateway/lib/resource";
import {Method} from "aws-cdk-lib/aws-apigateway/lib/method";

export interface Methodprops {
    functionName: string
    handlerName: string
    verb: string
    resource: Resource
    environment: any
    options?: any
}

export abstract class GenericApi extends Construct {
    public lambdaIntegration: LambdaIntegration;
    protected api: RestApi
    protected functions = new Map<string,NodejsFunction>()
    // private docs: GenerateOpenApiSpecProps

    protected constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id);
        this.api = new RestApi(this, id)
    }

    protected addMethod(props: Methodprops): NodejsFunction{
        const lambdaId = config.account + '-' + config.env + '-' + props.functionName
        const lambda = new NodejsFunction(this, lambdaId, {
            entry: join(__dirname, '..', '..', '..','src', 'handler', props.handlerName),
            handler: 'handler',
            functionName: lambdaId,
            environment: props.environment
        })
        this.functions.set(lambdaId,lambda)
        this.lambdaIntegration = new LambdaIntegration(lambda)
        props.resource.addMethod(props.verb, this.lambdaIntegration, props.options)
        return lambda;
    }

    public generateDocs(){
        // TODO
    }

}