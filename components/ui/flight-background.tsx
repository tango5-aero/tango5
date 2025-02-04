import Image from 'next/image';

const FlightBackground = () => {
    return (
        <div className="absolute bottom-20 right-0 w-[70%] opacity-15">
            <Image
                src="/images/flight.svg"
                alt="Flight background"
                objectFit="contain"
                objectPosition="bottom"
                width="1348"
                height="782"
            />
        </div>
    );
};

export { FlightBackground };
