import * as DynamoDB from 'aws-sdk/clients/dynamodb';

const DocumentClient = new DynamoDB.DocumentClient();

export const scanTable = async (params) => {
    const scanResults = [];
    let items;
    do{
        items =  await DocumentClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != 'undefined');
    return scanResults;
};