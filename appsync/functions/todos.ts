import { AppSyncResolverHandler } from "aws-lambda";
import { scanTable } from './lib/table';

const { TODOS_TABLE } = process.env;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);

    const todos = await scanTable({
        TableName: TODOS_TABLE,
        Limit: 10
    });
    console.log('todos', todos);

    return todos;
}
