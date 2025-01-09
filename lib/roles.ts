import { currentUser } from '@clerk/nextjs/server';

export const checkBackStageAccess = async () => {
    const user = await currentUser();

    if (!user) return false;

    const publicMetadata = user.publicMetadata;

    return publicMetadata.backstage === true;
};
