import Image from 'next/image';

const WelcomeTango5Title = () => {
    return (
        <div className="relative mb-14 flex h-44 flex-col items-end justify-between pl-40">
            <Image
                src="/images/tango5-logo.svg"
                width="138"
                height="171"
                className="absolute bottom-0 left-0"
                alt="5"
            />
            <span className="font-BarlowLight text-7xl">Welcome to</span>
            <Image src="/images/tango5.svg" width="355" height="73" alt="Tango5" />
        </div>
    );
};

export { WelcomeTango5Title };
