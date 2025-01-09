export {};

export type Roles = 'admin' | 'user';

declare global {
    interface UserPublicMetadata {
        role?: Roles;
    }
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}
