import { useEffect, useState } from "react";

function Hero() {
  const videos = ["/car1.mp4", "/car2.mp4", "/car3.mp4", "/car4.mp4"];

  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[600px] overflow-hidden flex items-center justify-center">

      {/* Background Video */}
      <video
        key={videos[currentVideo]}
        src={videos[currentVideo]}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text on top of video */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">

        <h1 className="text-5xl md:text-6xl font-bold">
          Move Around Ekiti With Ease
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
          Discover routes, transport options, and destinations
          across Ekiti State.
        </p>

        <button className="mt-8 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Explore Routes
        </button>

      </div>
    </section>
  );
}

export default Hero;