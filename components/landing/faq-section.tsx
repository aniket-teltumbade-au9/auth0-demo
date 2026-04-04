import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "Does the demo use real Auth0 middleware and callbacks?",
        answer:
            "Yes. The project is wired to the current Auth0 Next.js SDK, including middleware, the callback hook, and protected API routes."
    },
    {
        question: "How is MongoDB used in the walkthrough?",
        answer:
            "Each successful login silently upserts the visitor into MongoDB, then the settings form reads and updates the same record for a realistic account profile experience."
    },
    {
        question: "Can this show enterprise SSO without custom backend work?",
        answer:
            "Yes. The UI includes an SSO dashboard section designed to explain federation across enterprise domains while Auth0 handles the real login orchestration."
    },
    {
        question: "What about account linking for Google and Facebook?",
        answer:
            "The settings page uses Auth0's connected accounts flow so the client can see how linked identities surface inside a polished account center."
    }
];

export function FAQSection() {
    return (
        <section id="faq" className="section-shell pb-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">FAQ</p>
                <h2 className="section-title">Answers for the client conversation</h2>
                <p className="section-copy">
                    This keeps the landing page complete while reinforcing the technical decisions behind the demo.
                </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
                {faqs.map((faq) => (
                    <div key={faq.question} className="glass-panel p-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-400">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
