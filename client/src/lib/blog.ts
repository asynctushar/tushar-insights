export const linkGenerator = (link: string, lang?: string) => {
    if (!lang || lang !== "bn") {
        return link;
    } else {
        return `${link}/?lang=${lang}`;
    }
};