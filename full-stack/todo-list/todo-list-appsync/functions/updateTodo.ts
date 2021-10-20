import { AppSyncResolverHandler } from "aws-lambda";
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { getUpdateExpresion } from './lib/table';

const DocumentClient = new DynamoDB.DocumentClient();
const { TODOS_TABLE } = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);
    const { id, description } = event.arguments;

    const updateExpresion = getUpdateExpresion({ description, updatedAt: new Date().toJSON()});
    await DocumentClient.update({
        TableName: TODOS_TABLE,
        Key: { id },
        ...updateExpresion
    }).promise();

    return {
        id,
        description,
    };
}
