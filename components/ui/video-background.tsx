const VideoBackground = ({ colorBlend = 'dark' }: { colorBlend?: 'light' | 'dark' }) => {
    const color = colorBlend === 'light' ? 'bg-[#F8FDFF]' : 'bg-[#20282E]';
    return (
        <>
            <div className={`fixed left-0 top-0 z-10 h-full w-full mix-blend-soft-light ${color}`}></div>
            <video
                autoPlay
                loop
                muted
                className="fixed left-0 top-0 z-0 h-full w-full object-cover opacity-80"
                src="/video/databeacon-bg.mp4"></video>
            <div className={`fixed left-0 top-0 z-0 h-full w-full mix-blend-color ${color}`}></div>
        </>
    );
};

export { VideoBackground };
