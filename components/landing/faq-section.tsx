import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What is your hourly rate and how does billing work?",
        answer:
            "$20/hr, negotiable for long-term or high-volume engagements. Hourly work is billed weekly via Upwork or Freelancer. Fixed-price projects use milestone payments — typically 50% upfront and 50% on delivery."
    },
    {
        question: "Which frameworks and databases do you work with?",
        answer:
            "Backend: NestJS and Express.js. Frontend: Next.js (App Router). Databases: MongoDB (Mongoose) and MySQL. Deployment: Docker on AWS EC2, S3 for storage, and Vercel for frontend. CMS: Payload CMS."
    },
    {
        question: "Can you integrate Twilio, WhatsApp Business, or email providers?",
        answer:
            "Yes. I've worked with Twilio for SMS and voice, SendGrid and Mailgun for transactional email, MSG91 for India-market OTPs, and the Meta WhatsApp Business API for chat notifications. Demo pages for each are in progress."
    },
    {
        question: "Do you handle AWS deployment and Docker setup?",
        answer:
            "Yes. I containerise apps with Docker, deploy to AWS EC2, set up S3 for file storage, configure RDS or MongoDB Atlas, and build CI/CD pipelines. I also deploy Next.js and Payload CMS to Vercel or a custom VPS."
    },
    {
        question: "Can you build real-time features like video calls or live chat?",
        answer:
            "Yes — I can integrate Agora SDK for real-time video, audio, and live streaming. Live messaging and presence can be added with Socket.io or Agora RTM. Demos are coming soon to this page."
    },
    {
        question: "Is the Auth0 demo on this site production-quality code?",
        answer:
            "Yes. Session management, account linking via the Management API, MongoDB profile sync, and middleware-protected routes are all production-standard. The source is open for review during our scoping call."
    }
];

export function FAQSection() {
    return (
        <section id="faq" className="section-shell pb-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">FAQ</p>
                <h2 className="section-title">Common questions before we start</h2>
                <p className="section-copy">
                    Have a question not listed here? Reach out via Upwork or Freelancer and I&apos;ll respond within 24 hours.
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
