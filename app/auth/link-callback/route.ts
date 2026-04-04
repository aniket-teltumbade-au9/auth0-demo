import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { ManagementClient, PostIdentitiesRequestProviderEnum } from "auth0";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const returnTo = searchParams.get("returnTo") ?? "/settings";
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    const primarySub = req.cookies.get("linking_primary_sub")?.value;
    const session = await auth0.getSession();

    if (!session?.user || !primarySub) {
        return NextResponse.redirect(new URL(returnTo, appBaseUrl));
    }

    const secondarySub = session.user.sub;

    // don't link to itself
    if (primarySub === secondarySub) {
        return NextResponse.redirect(new URL(returnTo, appBaseUrl));
    }

    try {
        const management = new ManagementClient({
            domain: (process.env.AUTH0_DOMAIN ?? "").replace(/^https?:\/\//, ""),
            clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID!,
            clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET!,
        });

        const [provider, userId] = secondarySub.split("|");

        await management.users.link(
            { id: primarySub },
            {
                provider: provider as PostIdentitiesRequestProviderEnum,
                user_id: userId
            }
        );

        // restore primary user session
        await auth0.updateSession({
            ...session,
            user: {
                ...session.user,
                sub: primarySub
            }
        });

    } catch (err) {
        console.error("Account linking failed", err);
    }

    // clear the cookie
    const response = NextResponse.redirect(new URL(returnTo, appBaseUrl));
    response.cookies.delete("linking_primary_sub");
    return response;
}