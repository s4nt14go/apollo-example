import { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
    console.log('event', event);

    return [{
        id: 'dummy-id',
        description: 'dummy-description',
    }];
}
