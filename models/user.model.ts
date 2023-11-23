interface IUser {
    _id?: string;
    name?: string;
    email?: string;
    oAuthToken?: string;
    OAuthTokenForEmail?: string;
    lastLogin?: Date;
    updatedAt?: Date;
    createdAt?: Date;
}

export type  { IUser };