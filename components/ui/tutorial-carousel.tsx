'use client';
import Image from 'next/image';
import { Carousel } from 'nuka-carousel';

const TutorialCarousel = () => {
    return (
        <Carousel showDots showArrows>
            <Image src="/images/tutorial/tutorial1.png" alt="Tutorial 1" width={1920} height={1080} />
            <Image src="/images/tutorial/tutorial2.png" alt="Tutorial 2" width={1920} height={1080} />
            <Image src="/images/tutorial/tutorial3.png" alt="Tutorial 3" width={1920} height={1080} />
        </Carousel>
    );
};

export { TutorialCarousel };
