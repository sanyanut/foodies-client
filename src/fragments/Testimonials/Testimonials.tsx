import React, { useEffect, useState, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type SplideClass from "@splidejs/splide";
import "@splidejs/react-splide/css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Testimonial {
  id: string;
  testimonial: string;
  owner?: {
    name?: string;
  };
}

const QuoteIcon: React.FC = () => (
  <svg
    width="59"
    height="48"
    viewBox="0 0 59 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-6 text-[#BFBEBE]"
  >
    <path
      d="M0 48V31.9412C0 25.9412 1.05672 20.4118 3.17015 15.3529C5.28358 10.2941 8.86468 5.17647 13.9134 0L23.0716 7.2353C20.1363 10.1765 17.9055 12.9412 16.3791 15.5294C14.8527 18.1177 13.8547 20.7647 13.3851 23.4706H24.6567V48H0ZM34.3433 48V31.9412C34.3433 25.9412 35.4 20.4118 37.5134 15.3529C39.6269 10.2941 43.208 5.17647 48.2567 0L57.4149 7.2353C54.4796 10.1765 52.2488 12.9412 50.7224 15.5294C49.196 18.1177 48.198 20.7647 47.7284 23.4706H59V48H34.3433Z"
      fill="currentColor"
    />
  </svg>
);

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const splideRef = useRef<{ splide?: SplideClass }>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials`, {
          credentials: "include",
        });
        if (response.ok) {
          const data: Testimonial[] = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-[800px] px-4 py-8 text-center md:py-16">
      <p className="mb-2 text-[16px] font-medium leading-[150%] tracking-[-0.02em] text-[#1a1a1a] opacity-60">
        What our customer say
      </p>

      <h2 className="mb-12 text-[40px] font-extrabold leading-[110%] tracking-[-0.02em] text-[#050505] uppercase">
        TESTIMONIALS
      </h2>

      <Splide
        ref={splideRef}
        options={{
          type: "loop",
          autoplay: true,
          interval: 4000,
          pauseOnHover: false,
          arrows: false,
          pagination: false,
          speed: 600,
        }}
        onMove={(_: SplideClass, index: number) => setActiveIndex(index)}
        aria-label="Testimonials"
      >
        {testimonials.map((item) => (
          <SplideSlide key={item.id}>
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-[800px] pl-[8px] text-left md:pl-[40px]">
                <QuoteIcon />
              </div>

              <p className="mx-auto max-w-[800px] text-[18px] font-medium leading-[150%] tracking-[-0.02em] text-[#050505] md:text-[24px]">
                {item.testimonial}
              </p>

              <h4 className="mt-8 text-[18px] font-extrabold leading-[120%] tracking-[-0.02em] text-[#050505] uppercase md:text-[20px]">
                {item.owner?.name}
              </h4>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      
      <div className="mt-8 flex h-4 items-center justify-center gap-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => splideRef.current?.splide?.go(index)}
            className={`h-4 w-4 rounded-full transition-colors duration-300 ${
              activeIndex === index ? "bg-[#050505]" : "bg-[#BFBEBE]"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
