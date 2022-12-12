import {Construct} from "constructs";
import {GenericDynamoTable} from "../generic/GenericDynamoTable";
import {GenericApi} from "../generic/GenericApi";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
const apigateway = require("@aws-cdk/aws-apigateway");
import {JsonSchemaType, RestApi} from "aws-cdk-lib/aws-apigateway";

export interface TodoApiProps {
    todoTable: GenericDynamoTable
}

export class TodoApis extends GenericApi {
    private props: TodoApiProps
    private getApi: NodejsFunction
    private createApi: NodejsFunction
    private editApi: NodejsFunction
    private deleteApi: NodejsFunction

    public constructor(scope: Construct, id: string, props: TodoApiProps) {
        super(scope, id)
        this.props = props
        this.addApis();

        this.props.todoTable.table.grantFullAccess(this.getApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.createApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.editApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.deleteApi.grantPrincipal)
    }

    private addApis(){
        const todoApiResource = this.api.root.addResource('todo')
        const todoIdResource = todoApiResource.addResource('{id}')
        this.getApi = this.addMethod({
            functionName: 'todo-get',
            handlerName: 'todo-get-handler.ts',
            verb: 'GET',
            resource: todoIdResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
        })

        // const todoModel = new apigateway.Model(this, "model-validator", {
        //     restApi: this.api,
        //     contentType: "application/json",
        //     description: "To validate the request body",
        //     modelName: "todoModel",
        //     schema: {
        //         type: JsonSchemaType.OBJECT,
        //         required: ["description"],
        //         properties: {
        //             description: { type: "string" },
        //         },
        //     },
        // });

        // const requestValidator = new apigateway.RequestValidator(
        //     scope,
        //     'body-validator',
        //     {
        //         restApi: api,
        //         requestValidatorName: "body-validator",
        //         validateRequestBody: true,
        //     }
        // )

        this.createApi = this.addMethod({
            functionName: 'todo-post',
            handlerName: 'todo-create-handler.ts',
            verb: 'POST',
            resource: todoApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            options: {
                // requestValidator: new apigateway.RequestValidator(
                //     scope,
                //     "body-validator",
                //     {
                //         restApi: api,
                //         requestValidatorName: "body-validator",
                //         validateRequestBody: true,
                //     }
                // ),
                // requestModels: {
                //     "application/json": todoModel,
                // },
            }
        })

        this.editApi = this.addMethod({
            functionName: 'todo-put',
            handlerName: 'todo-edit-handler.ts',
            verb: 'PUT',
            resource: todoApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            }
        })

        this.deleteApi = this.addMethod({
            functionName: 'todo-delete',
            handlerName: 'todo-delete-handler.ts',
            verb: 'DELETE',
            resource: todoApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            }
        })
    }

}