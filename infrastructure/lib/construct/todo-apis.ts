import {Construct} from "constructs";
import {GenericTableProps} from "../generic/GenericDynamoTable";
import {GenericApi} from "../generic/GenericApi";

export class TodoApis extends GenericApi {

    public constructor(scope: Construct, id: string) {
        super(scope, id)

        this.addApi({
            functionName: 'hello',
            handlerName: 'hello-get-handler.ts',
            httpMethod: 'GET',
            apiPath: 'hello',
            environment: {}
        })

    }
}