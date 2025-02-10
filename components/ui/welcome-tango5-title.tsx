import Image from 'next/image';

const WelcomeTango5Title = () => {
    return (
        <div className="relative mb-14 flex h-32 flex-col items-end justify-between pl-32">
            <Image
                src="/images/tango5-logo.svg"
                width="100"
                height="120"
                className="absolute bottom-0 left-0"
                alt="5"
            />
            <span className="font-BarlowLight text-6xl leading-10 text-background">Welcome to</span>
            <Image src="/images/tango5.svg" width="304" height="63" alt="Tango5" />
        </div>
    );
};
// 4.81
export { WelcomeTango5Title };
