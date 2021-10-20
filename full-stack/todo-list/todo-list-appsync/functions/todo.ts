import { AppSyncResolverHandler } from "aws-lambda";
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

const DocumentClient = new DynamoDB.DocumentClient();
const { TODOS_TABLE } = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);
    const { id } = event.arguments;

    const { Item: todo } = await DocumentClient.get({
        TableName: TODOS_TABLE,
        Key: { id },
    }).promise();

    return todo;
}
