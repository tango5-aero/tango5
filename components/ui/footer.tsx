import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="mt-auto flex w-full flex-row items-center justify-between bg-translucent px-10 py-5">
            <Link href="https://databeacon.aero/" target="_blank">
                <Image src="/images/databeacon.png" width="70" height="70" alt="DataBeacon" />
            </Link>
            <div className="flex flex-row items-center justify-start gap-5">
                <p className="font-barlow text-sm font-light">© 2025 DataBeacon</p>
                <Link className="font-barlow text-sm font-light" href="/privacy-policy">
                    Privacy Policy
                </Link>
            </div>
            <div className="flex w-48 justify-end">
                <Link href="https://www.linkedin.com/company/databeaconaero/" target="_blank">
                    <Image src="/images/linkedin.svg" width="30" height="30" alt="LinkedIn" />
                </Link>
            </div>
        </footer>
    );
};

export { Footer };
