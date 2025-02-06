import Link from 'next/link';
import { TutorialCarousel } from '~/components/ui/tutorial-carousel';
import { VideoBackground } from '~/components/ui/video-background';

export default async function Page() {
    return (
        <>
            <main className="relative z-20 flex flex-col items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-6 p-12">
                    <TutorialCarousel />
                </div>
                <div className="flex w-full flex-col">
                    <h2 className="mb-8 w-full text-center font-BarlowBold text-4xl" id="faq">
                        FAQs
                    </h2>
                    <FAQAccordion
                        question="1. How does Tango5 define a potential conflict?"
                        answer="Your job in the first tool of Tango5 is to detect every time a crossing is within 9NM (Nautical Miles), which are potential conflicts that need to be monitored. The minimum acceptable separation is 5NM in most regions, such as the ones we are displaying."
                    />
                    <FAQAccordion
                        question="2. If the legal separation is 5NM, why do controllers need to monitor below 9NM?"
                        answer="When two aircraft get slightly above 5NM at the crossing (5-9NM), controllers need to specially monitor the pair, so that they don’t miss the legal separation due to changes of wind, speed, etc."
                    />
                    <FAQAccordion
                        question="3. How realistic are Tango5 scenarios?"
                        answer="All scenarios in Tango5 represent real traffic and have been automatically curated using our tools for data analysis and conflict alert algorithms, ensuring they are based on real traffic scenarios."
                    />
                    <FAQAccordion
                        question="4. Why is traffic in Tango5 not moving?"
                        answer="Because of the increasing complexity. We wanted  the first tool of Tango5 to be as accessible as possible but still giving value and a challenge to experienced ATCOs. We will include this feature in future releases, stay tuned!"
                    />
                    <FAQAccordion
                        question="5. How many scenarios are available?"
                        answer="We can generate tens of thousands of different scenarios from any type of surveillance data. We work with a variety of historical data which is curated to automatically select different scenarios thanks to our data processing platform Victor5."
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
        <details className="group w-full border-b border-map bg-map-foreground px-12 py-3">
            <summary className="flex list-none flex-row justify-between font-BarlowBold text-xl transition-[margin] duration-300 ease-in-out hover:cursor-pointer group-open:mb-3">
                {question}
                <div>
                    <span className="font-BarlowLight text-3xl leading-5 group-open:hidden">+</span>
                    <span className="hidden font-BarlowLight text-3xl leading-5 group-open:inline-block">-</span>
                </div>
            </summary>
            <div className="mt-4 font-BarlowLight">{answer}</div>
        </details>
    );
};
