import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody} from "../lib/utils";
import {Env} from "../lib/env";
import {TodoService} from "../service/TodoService";
import {TodoEditParams} from "../service/types";

const table = Env.get('TODO_TABLE')
const todoService = new TodoService({
    table: table
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello From Todo Edit Api!'
    }
    try {
        const item = getEventBody(event) as TodoEditParams;
        const todo = await todoService.edit(item)
        result.body = JSON.stringify(todo)
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}