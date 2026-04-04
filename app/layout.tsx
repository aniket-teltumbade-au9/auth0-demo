import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { auth0 } from "@/lib/auth0";

import "./globals.css";

export const metadata: Metadata = {
    title: "Auth0 Client Demo",
    description: "High-fidelity Auth0 demo built with Next.js, TypeScript, Tailwind CSS, and MongoDB."
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth0.getSession();

    return (
        <html lang="en">
            <body>
                <Auth0Provider user={session?.user}>
                    <SiteHeader
                        isAuthenticated={Boolean(session)}
                        userName={session?.user.name || session?.user.email}
                    />
                    <main>{children}</main>
                    <SiteFooter />
                </Auth0Provider>
            </body>
        </html>
    );
}
