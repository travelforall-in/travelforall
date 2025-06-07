import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface Props {
  children: React.ReactNode;
}

const SmoothScrollWrapper: React.FC<Props> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInstance = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollInstance.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1.3,
    });

    return () => {
      scrollInstance.current?.destroy();
    };
  }, []);

  return (
    <div data-scroll-container ref={scrollRef} className="scroll-container">
      {children}
    </div>
  );
};

export default SmoothScrollWrapper;
