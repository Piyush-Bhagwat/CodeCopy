import { Space_Mono } from "next/font/google";
import "./globals.css";
import AppContext from "@/context/AppContext";

const inter = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
    title: "CodeCopy",
    description: "Efficiant way to share code with teamates",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <AppContext>
                <body className={inter.className}>{children}</body>
            </AppContext>
        </html>
    );
}
