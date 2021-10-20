import { AppSyncResolverHandler } from "aws-lambda";
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid'

const DocumentClient = new DynamoDB.DocumentClient();
const { TODOS_TABLE } = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);
    const { description } = event.arguments;

    const Item = {
        id: ulid(),
        description,
    }

    await DocumentClient.put({
        TableName: TODOS_TABLE,
        Item,
    }).promise();

    await new Promise(resolve =>
        setTimeout(resolve, 5000)
    );  // To highlight optimistic response in client

    return Item;
}
