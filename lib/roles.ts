import { Roles } from '~/types/globals';
import { currentUser } from '@clerk/nextjs/server';

export const checkRole = async (role: Roles) => {
    const user = await currentUser();

    if (!user) return false;

    const publicMetadata = user.publicMetadata;

    return publicMetadata.role === role;
};
