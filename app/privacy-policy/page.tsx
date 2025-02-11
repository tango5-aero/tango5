import Link from 'next/link';

import Image from 'next/image';

export default function Page() {
    return (
        <main className="min-h-screen bg-[url('/images/map.jpg')] bg-center bg-no-repeat p-52 font-barlow">
            <Image
                src="/images/tango5-logo.svg"
                className="h-[132px] w-[110px] xl:h-[157px] xl:w-[131px] 2xl:h-[193px] 2xl:w-[161px]"
                width="140"
                height="168"
                alt="Tango 5 logo"
            />
            <h1 className="text-3xl font-bold">Tango5 Privacy Policy</h1>
            <br />

            <h2 className="text-xl font-bold">Information We Collect</h2>

            <br />
            <p>
                We may collect various information from our visitors. This information includes analytical data, such as
                the time and duration of a visit. We will also collect contact details if this is provided voluntarily,
                for example by signing up to our newsletter or product updates.
            </p>
            <br />

            <h2 className="text-xl font-bold">Use of Information</h2>

            <br />
            <p>
                The information we collect will be used to improve user experience as well as the quality of our site.
                Analytical data can be used for SEO purposese(search engine optimisation) in addition to identifying
                characteristic of our users. This data is collected through cookies and is analysed with the use of
                PostHog service. Please see below for more information regarding cookies.
            </p>
            <p>
                For personal details provided voluntarily, said details may be used to contact individuals with news or
                promotions.
            </p>
            <br />

            <h2 className="text-xl font-bold">Use of Cookies</h2>

            <br />
            <p>
                A cookie is a small file which asks for permission to be placed on a computer’s hard drive. Once agreed
                upon, the file is added and the cookie helps analyse web traffic or provides notifications of visits to
                particular sites. We use traffic log cookies to identify which pages are being used. This helps us
                analyse data on webpage traffic and improve our website in order to tailor it to our clients’
                needs. Such information will not identify a visitor personally as it is statistical data which does not
                identify any personal details whatsoever. Following statistical analysis, the data is removed from the
                system.
            </p>
            <p>
                Our website may contain links to other websites of interest. Please note that once a visitor clicks on a
                link to any other website, we do not have control over that website. We cannot accept responsibility for
                the protection and privacy of any personal data provided to such sites, and such sites are not governed
                by this privacy policy. Please review their privacy policy before sending them any personal data.
            </p>
            <p>Settings can be adjusted to decline cookies, usually through a tab or option named “Settings”.</p>
            <br />

            <h2 className="text-xl font-bold">Storing Your Personal Data.</h2>

            <br />
            <p>
                We will not sell, distribute or lease personal information to third parties unless we have permission or
                are required by law to do so. Non-personal data will be shared with PostHog. Their privacy policy can be
                found at their website.
            </p>
            <p>
                We do our utmost to ensure that all reasonable steps are taken to make sure that data is stored
                securely. Unfortunately, the sending of information via the internet is not always secure and on
                occasion such information can be intercepted. We cannot guarantee the security of data that is chosen to
                be sent to us electronically; sending such information is entirely at the risk of the user.
            </p>
            <br />

            <h2 className="text-xl font-bold">Access to Information</h2>

            <br />
            <p>
                Users have the right to ask for a copy of their information we hold about them and to have any
                inaccuracies in their information corrected.
            </p>
            <br />
            <h2 className="text-xl font-bold">Contacting Us</h2>

            <br />
            <p>For any queries regarding this Privacy and Cookies policy, please email: tango5@databeacon.aero</p>
            <br />

            <Image
                src="/images/developed-by.png"
                className="mx-auto my-5 h-[80px] w-[350px] xl:h-[90px] xl:w-[392px] 2xl:h-[100px] 2xl:w-[436px]"
                width="436"
                height="100"
                alt="Tango 5: developed by DataBeacon"
            />

            <Link className="mx-auto underline" href="/">
                &larr; Go back
            </Link>
        </main>
    );
}
