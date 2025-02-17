import Image from 'next/image';

const FlightBackground = () => {
    return (
        <div className="absolute bottom-80 right-0 w-[70%] opacity-15 xl:bottom-60 2xl:bottom-40">
            <Image
                src="/images/flight.svg"
                alt="Flight background"
                style={{ objectFit: 'contain', objectPosition: 'bottom' }}
                width="1348"
                height="782"
            />
        </div>
    );
};

export { FlightBackground };
