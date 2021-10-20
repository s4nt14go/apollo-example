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

export function getUpdateExpresion(update: any) {
    let prefix = "set ";
    const updateExpresion: any = {
        UpdateExpression: '',
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {}
    };
    const attributes = Object.keys(update)
    for (let i=0; i<attributes.length; i++) {
        const attribute = attributes[i]
        // if (attribute !== "id") {
        if (update[attribute] !== undefined) {
            updateExpresion["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute
            updateExpresion["ExpressionAttributeValues"][":" + attribute] = update[attribute]
            updateExpresion["ExpressionAttributeNames"]["#" + attribute] = attribute
            prefix = ", "
        }
    }
    return updateExpresion;
}