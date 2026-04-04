import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatConnectionName(connection: string) {
    const labels: Record<string, string> = {
        "google-oauth2": "Google",
        facebook: "Facebook",
        sms: "SMS Passwordless",
        email: "Email Passwordless",
        auth0: "Database"
    };

    return labels[connection] ?? connection;
}
