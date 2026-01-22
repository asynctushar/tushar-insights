export const getLang = (searchParams: { lang?: string; }) => {
    return searchParams.lang === 'bn' ? 'bn' : 'en';
};
