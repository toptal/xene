declare type User = {
    id: string;
    email: string;
    handler: string;
    fullName: string;
    lastName: string;
    firstName: string;
};
export default User;
export declare type PartialUser = {
    id?: string;
    email?: string;
    handler?: string;
    fullName?: string;
    lastName?: string;
    firstName?: string;
};
