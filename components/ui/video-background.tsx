const VideoBackground = () => {
    return (
        <>
            <div className="absolute left-0 top-0 z-10 h-full w-full bg-[#20282E] mix-blend-color"></div>
            <video
                autoPlay
                loop
                muted
                className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-80"
                src="/video/databeacon-bg.mp4"></video>
            <div className="absolute left-0 top-0 z-0 h-full w-full bg-[#011B26] opacity-50"></div>
        </>
    );
};

export { VideoBackground };
