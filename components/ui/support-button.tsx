'use client';
import { usePostHog } from 'posthog-js/react';
import { Button } from './button';
import { HeadsetIcon } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from './textarea';

const surveyID = '0194f50b-fb21-0000-9514-087ad94e5984';

const SupportButton = () => {
    const posthog = usePostHog();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setShowMessage(false);
    };

    const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const message = form.message.value as typeof form.elements & {
            message: { value: string };
        };
        posthog.capture('support-form-sent', {
            $survey_id: surveyID,
            $survey_response: message
        });
        setShowMessage(true);
    };

    return (
        <>
            <Button
                onClick={handleOpenForm}
                className="fixed right-4 top-[50%] z-40 h-8 w-8 rounded-full shadow-xl"
                id="support-button">
                <HeadsetIcon />
            </Button>
            {isFormOpen && (
                <div className={`fixed bottom-0 right-6 z-40 rounded-3xl bg-map px-8 py-5 shadow-2xl`}>
                    <Button
                        onClick={handleCloseForm}
                        className="absolute right-0 top-0 bg-transparent font-barlow text-lg font-light text-map-foreground shadow-none hover:bg-transparent hover:text-map-foreground/60">
                        X
                    </Button>
                    {!showMessage && (
                        <>
                            <p className="pb-3 pt-1 font-barlow text-xl font-bold text-map-foreground">
                                What can we do for you?
                            </p>
                            <form onSubmit={handleFormSubmit}>
                                <Textarea
                                    id="supportInput"
                                    name="message"
                                    placeholder="Type your feedback here..."
                                    className="border-white font-barlow !text-lg font-light text-map-foreground placeholder:text-map-foreground/40"
                                    required></Textarea>
                                <Button
                                    className="mt-6 w-full rounded-full bg-map-foreground font-barlow text-lg text-map hover:bg-map-foreground/60"
                                    type="submit">
                                    Submit
                                </Button>
                            </form>
                        </>
                    )}
                    {showMessage && (
                        <p className="py-3 font-barlow text-xl font-light text-map-foreground">
                            Thank you for your feedback!
                        </p>
                    )}
                </div>
            )}
        </>
    );
};
export { SupportButton };
