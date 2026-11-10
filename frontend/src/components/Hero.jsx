
import { useRef, useState } from "react";

function Hero() {
  const videos = [
    "/car1.mp4",
    "/car2.mp4",
    "/car3.mp4",
    "/car4.mp4",
  ];

  const [slots, setSlots] = useState([
    videos[0],
    videos[1],
  ]);

  const [activeSlot, setActiveSlot] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const videoRefs = useRef([]);
  const waitingRef = useRef(false);
  const switchingRef = useRef(false);

  const switchToNext = async () => {
    if (switchingRef.current) return;

    const nextSlot = 1 - activeSlot;
    const nextVideo = videoRefs.current[nextSlot];

    if (!nextVideo || nextVideo.readyState < 3) {
      waitingRef.current = true;
      return;
    }

    switchingRef.current = true;

    try {
      await nextVideo.play();

      const nextIndex = (activeIndex + 1) % videos.length;

      setActiveSlot(nextSlot);
      setActiveIndex(nextIndex);

      // Prepare the following video in the background.
      setSlots((previous) => {
        const updated = [...previous];
        updated[activeSlot] =
          videos[(nextIndex + 1) % videos.length];

        return updated;
      });

      waitingRef.current = false;
    } catch (error) {
      console.error("Unable to play next background video:", error);
    } finally {
      switchingRef.current = false;
    }
  };

  const handleVideoEnded = () => {
    waitingRef.current = true;
    switchToNext();
  };

  const handleVideoReady = (slot) => {
    if (slot !== activeSlot && waitingRef.current) {
      switchToNext();
    }
  };

  return (
    <section className="relative min-h-[600px] overflow-hidden flex items-center justify-center">

      {/* Background Videos */}
      {slots.map((video, slot) => (
        <video
          key={slot}
          ref={(element) => {
            videoRefs.current[slot] = element;
          }}
          src={video}
          autoPlay={slot === activeSlot}
          muted
          playsInline
          preload="auto"
          onEnded={slot === activeSlot ? handleVideoEnded : undefined}
          onCanPlay={() => handleVideoReady(slot)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            slot === activeSlot
              ? "opacity-100 z-0"
              : "opacity-0 -z-10"
          }`}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Text on top of video */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white">

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
