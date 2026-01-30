export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateReactionType = (type: string) => {
    const validTypes = ['like', 'love', 'haha', 'sad', 'angry'];

    return validTypes.includes(type);
};