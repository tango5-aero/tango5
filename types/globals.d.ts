export {};

declare global {
    interface UserPublicMetadata {
        backstage?: boolean;
    }
    interface CustomJwtSessionClaims {
        metadata: {
            backstage?: boolean;
        };
    }
}
