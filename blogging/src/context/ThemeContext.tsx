"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
type Theme = "light" | "dark";

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Load from localStorage on first load
    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme;
        const current = saved || "light";



        setTheme(current);
        document.documentElement.classList.toggle("dark", current === "dark");
    }, []);

    const toggleTheme = () => {
        setIsTransitioning(true);

        setTimeout(() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);

            document.documentElement.classList.toggle("dark", next === "dark");
            localStorage.setItem("theme", next);
        }, 300); // change theme after animation starts

        // remove animation after end
        setTimeout(() => setIsTransitioning(false), 700);
    };
    return (
        <>
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ x: "100%", backgroundColor: theme === "dark" ? "#ffffff" : "#000000" }}
                        animate={{ x: "0%", backgroundColor: theme === "dark" ? "#000000" : "#ffffff" }}
                        exit={{ x: "-100%" }}
                        transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                            backgroundColor: { duration: 0.6 }, // smooth color fade
                        }}
                        className="fixed inset-0 z-[99999] pointer-events-none"
                    />

                )}
            </AnimatePresence>

            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                {children}
            </ThemeContext.Provider>
        </>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};
