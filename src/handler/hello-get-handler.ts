import {
    Context,
    APIGatewayProxyCallback,
    APIGatewayEvent,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }
    return result
}