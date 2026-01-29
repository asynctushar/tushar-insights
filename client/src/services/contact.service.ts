export const sendContactMessage = ({ name, email, message, }: { name: string, email: string, message: string; }) =>
    fetch("https://asynctushar.vercel.app/api/public/message", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            message,
            subject: "New Contact Message from Tushar Insights",
        }),
        cache: "no-store"
    }

    );