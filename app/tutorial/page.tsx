import Link from 'next/link';
import { TutorialCarousel } from '~/components/ui/tutorial-carousel';
import { VideoBackground } from '~/components/ui/video-background';

export default async function Page() {
    return (
        <>
            <main className="relative z-20 flex flex-col items-center justify-center gap-12 p-12 md:p-10">
                <div className="flex flex-col items-center gap-6">
                    <TutorialCarousel />
                </div>
                <div className="flex w-full max-w-[1364px] flex-col gap-2">
                    <h2 className="mb-4 w-full text-center font-BarlowBold text-4xl" id="faq">
                        FAQ
                    </h2>
                    <FAQAccordion
                        question="What is Tango5?"
                        answer="Tango5 (or T5 for short) is a suite of tools designed to enhance and challenge your Air Traffic Control (ATC) skills."
                    />
                    <FAQAccordion
                        question="What is the first tool of the Tango5 suite?"
                        answer="The first Tango5 tool focuses on sharpening your eye to identify all potential conflicts before the time runs out, simulating the experience of an en-route radar Air Traffic Controller (ATCO) when identifying potential conflicts."
                    />
                    <FAQAccordion
                        question="How does Tango5 define a potential conflict?"
                        answer="Your job in the first tool of Tango5 is to detect every time a crossing is within 9NM (Nautical Miles), which are potential conflicts that need to be monitored. The minimum acceptable separation is 5NM in most regions, such as the ones we are displaying."
                    />
                    <FAQAccordion
                        question="How realistic are Tango5 scenarios?"
                        answer="All scenarios in Tango5 represent real traffic and have been automatically curated using our tools for data analysis and conflict alert algorithms, ensuring they are based on real traffic scenarios."
                    />
                    <FAQAccordion
                        question="Is Tango5 only for en-route ATC control?"
                        answer="At this moment we are focussing on en-route. We are working on similar tools for approach control and tower."
                    />
                    <FAQAccordion
                        question="Why is traffic in Tango5 not moving?"
                        answer="Because of the increasing complexity. We wanted  the first tool of Tango5 to be as accessible as possible but still giving value and a challenge to experienced ATCOs. We will include this feature in future releases, stay tuned!"
                    />
                    <FAQAccordion
                        question="How many scenarios are available?"
                        answer="We can generate tens of thousands of different scenarios from any type of surveillance data. We work with a variety of historical data which is curated to automatically select different scenarios thanks to our data processing platform Victor5."
                    />
                    <FAQAccordion
                        question="Can Tango5 be used for professional ATC training?"
                        answer="Yes. We are discussing with several Air Navigation Service Providers how this can support traditional training in simulators. Tango5 offers several advantages that need to be discussed with your civil aviation authority. Please, contact us at info@DataBeacon.aero if you are interested."
                    />
                    <FAQAccordion
                        question="Can Tango5 be used for Air Traffic Control candidate selection?"
                        answer="Yes. We are confident that if offers an easy, objective, and measurable method for assessing Air Traffic Controller skills."
                    />
                    <FAQAccordion
                        question="How much does Tango5 cost?"
                        answer="The current pre-release is free of use for the time being. However, as more tools and features are released, and more scenarios uploaded, this might change. "
                    />
                    <FAQAccordion
                        question="How does Tango5 manage personal data?"
                        answer="Yes. In no way your data will ever made public. In fact, Tango5 does not store any personal data, all personal data is managed by clerk.com  which has public data processing agreements and a strong data privacy policy. 
We might, however, make use of the anonymized data collected from your interaction with the platform, to this end we use posthog.com you can read their security and privacy guidelines and compliance. "
                    />
                    <FAQAccordion
                        question="Can Tango5 be localized to a particular region?"
                        answer="Yes. The current pre-release is showing scenarios from USA air traffic. We can automatically process surveillance data from any region to offer a localized set of scenarios in different regions."
                    />
                    <FAQAccordion
                        question="If the legal separation is 5NM, why do controllers need to monitor below 9NM?"
                        answer="When two aircraft get slightly above 5NM at the crossing (5-9NM), controllers need to specially monitor the pair, so that they don’t miss the legal separation due to changes of wind, speed, etc."
                    />
                </div>

                <Link
                    href="/play"
                    className="h-12 rounded-full bg-map px-8 py-2 font-BarlowBold text-2xl font-bold leading-7 text-map-foreground shadow hover:bg-map/85">
                    START
                </Link>
            </main>
            <VideoBackground colorBlend="light" />
        </>
    );
}

const FAQAccordion = ({ question, answer }: { question: string; answer: string }) => {
    return (
        <details className="w-full rounded-full border border-map bg-map-foreground px-10 py-3">
            <summary className="list-none font-BarlowLight text-xl hover:cursor-pointer">{question}</summary>
            <div className="mt-4 font-BarlowLight">{answer}</div>
        </details>
    );
};
