import { FAQSection } from "@/components/landing/faq-section";
import { IntegrationsSection } from "@/components/landing/auth-preview";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { auth0 } from "@/lib/auth0";

export default async function HomePage() {
    const session = await auth0.getSession();

    return (
        <>
            <HeroSection isAuthenticated={Boolean(session)} />
            <IntegrationsSection />
            <PricingSection />
            <FAQSection />
        </>
    );
}
