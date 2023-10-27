
export const getUserName = (userId: string): string =>
    userId.split('#')[0];

export const getUserLocation = (userId: string): string =>
    userId.split('#')[1];

    export const getUserHash = (userId: string): string =>
    userId.split('#')[2];
