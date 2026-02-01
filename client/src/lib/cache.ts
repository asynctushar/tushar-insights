import { revalidateTag } from 'next/cache';

export const revalidateTags = async (tags: string[]) => {
    for (const tag of tags) {
        revalidateTag(tag, "max");
    }
};