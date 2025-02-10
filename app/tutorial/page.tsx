import { PropsWithoutRef } from 'react';
import { FlightBackground } from '~/components/ui/flight-background';
import { TutorialCarousel } from '~/components/ui/tutorial-carousel';

const faqs = [
    {
        question: '1. How does Tango5 define a potential conflict?',
        answer: 'Your job in the first tool of Tango5 is to detect every time a crossing is within 9NM (Nautical Miles), which are potential conflicts that need to be monitored. The minimum acceptable separation is 5NM in most regions, such as the ones we are displaying.'
    },
    {
        question: '2. If the legal separation is 5NM, why do controllers need to monitor below 9NM?',
        answer: 'When two aircraft get slightly above 5NM at the crossing (5-9NM), controllers need to specially monitor the pair, so that they don’t miss the legal separation due to changes of wind, speed, etc.'
    },
    {
        question: '3. How realistic are Tango5 scenarios?',
        answer: 'All scenarios in Tango5 represent real traffic and have been automatically curated using our tools for data analysis and conflict alert algorithms, ensuring they are based on real traffic scenarios.'
    },
    {
        question: '4. Why is traffic in Tango5 not moving?',
        answer: 'Because of the increasing complexity. We wanted  the first tool of Tango5 to be as accessible as possible but still giving value and a challenge to experienced ATCOs. We will include this feature in future releases, stay tuned!'
    },
    {
        question: '5. How many scenarios are available?',
        answer: 'We can generate tens of thousands of different scenarios from any type of surveillance data. We work with a variety of historical data which is curated to automatically select different scenarios thanks to our data processing platform Victor5.'
    }
];

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
                    <div className="flex flex-col items-center bg-map-foreground py-10">
                        {faqs.map((faq, index) => (
                            <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </main>
            <FlightBackground />
        </>
    );
}

const FAQAccordion = (props: PropsWithoutRef<{ question: string; answer: string }>) => {
    return (
        <details className="group h-14 w-full max-w-[1364px] overflow-hidden border-b border-map px-4 py-3 transition-all duration-500 ease-out open:h-36">
            <summary className="flex list-none flex-row justify-between font-BarlowBold text-xl hover:cursor-pointer hover:text-map">
                {props.question}
                <div>
                    <span className="font-BarlowLight text-3xl leading-5 group-open:hidden">+</span>
                    <span className="hidden font-BarlowLight text-3xl leading-5 group-open:inline-block">-</span>
                </div>
            </summary>
            <div className="mt-4 font-BarlowLight">{props.answer}</div>
        </details>
    );
};
