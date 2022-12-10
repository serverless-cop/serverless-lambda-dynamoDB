import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {join} from "path";
import config from "../../config/config";
import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {GenericDynamoTable} from "./GenericDynamoTable";
import {DocumentationGenerator, GenerateOpenApiSpecProps} from "../docs";

export interface ApiProps {
    functionName: string
    handlerName: string
    httpMethod: string
    apiPath: string
    environment: any
}

export abstract class GenericApi extends Construct {
    public lambdaIntegration: LambdaIntegration;
    private api: RestApi
    protected functions = new Map<string,NodejsFunction>()

    // private docs: GenerateOpenApiSpecProps

    public constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id);
        // this.props = props
        this.api = new RestApi(this, id)
    }

    protected addApi(props: ApiProps){
        const lambdaId = config.account + '-' + config.env + '-' + props.functionName
        const lambda = new NodejsFunction(this, lambdaId, {
            entry: join(__dirname, '..', '..','src', 'handler', props.handlerName),
            handler: 'handler',
            functionName: lambdaId,
            environment: props.environment
        })
        this.functions.set(lambdaId,lambda)
        this.lambdaIntegration = new LambdaIntegration(lambda)
        const lambdaResource = this.api.root.addResource(props.apiPath)
        lambdaResource.addMethod(props.httpMethod, this.lambdaIntegration)
    }

    public generateDocs(){
        // TODO
    }

}