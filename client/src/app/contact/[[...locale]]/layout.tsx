import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Tushar Biswas for collaboration, freelance work, or web development inquiries.",

    keywords: [
        "Contact Tushar Biswas",
        "Hire Frontend Developer",
        "Hire Full Stack Developer",
        "Freelance Web Developer",
        "Web Development Contact",
    ],

    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
