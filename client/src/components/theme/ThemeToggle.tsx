"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const onToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button variant="default" size="icon" onClick={onToggle} className="hover:bg-primary-foreground/20">
            {theme === "light" ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeToggle;