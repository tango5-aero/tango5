'use client';
import Image from 'next/image';
import { Carousel, useCarousel } from 'nuka-carousel';

const TutorialCarousel = () => {
    return (
        <Carousel className="max-w-[1364px]" showDots showArrows dots={<CustomDots />}>
            <Image src="/images/tutorial/tutorial1.jpg" alt="Tutorial 1" width={1364} height={767} />
            <Image src="/images/tutorial/tutorial2.jpg" alt="Tutorial 2" width={1364} height={767} />
            <Image src="/images/tutorial/tutorial3.jpg" alt="Tutorial 3" width={1364} height={767} />
            <Image src="/images/tutorial/tutorial3.jpg" alt="Tutorial 4" width={1364} height={767} />
        </Carousel>
    );
};

export const CustomDots = () => {
    const { totalPages, currentPage, goToPage } = useCarousel();

    return (
        <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`h-3 w-3 rounded-full p-0 ${currentPage === index ? 'bg-map' : 'bg-carouselDots'} cursor-pointer border-none hover:bg-map`}
                />
            ))}
        </div>
    );
};

export { TutorialCarousel };
