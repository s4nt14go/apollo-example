import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);
    const { description } = event.arguments;

    return {
        id: 'dummy-id',
        description,
    };
}
