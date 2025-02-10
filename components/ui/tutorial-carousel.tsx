'use client';
import Image from 'next/image';
import { Carousel, useCarousel } from 'nuka-carousel';

const TutorialCarousel = () => {
    const slides = Array.from({ length: 4 }, (_, i) => i + 1);

    return (
        <Carousel className="max-w-[1364px]" showDots showArrows dots={<CustomDots />}>
            {slides.map((slide) => (
                <div key={slide} className="carousel-slide">
                    <Image
                        src={`/images/tutorial/tutorial${slide}.jpg`}
                        alt={`Tutorial ${slide}`}
                        width={1364}
                        height={767}
                    />
                </div>
            ))}
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
