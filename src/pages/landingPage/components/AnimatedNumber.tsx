import { useEffect, useState } from "react";

const AnimatedNumber: React.FC<{
  to: number;
  suffix?: string;
  duration?: number;
}> = ({ to, suffix = "", duration = 900 }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(t * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <span className="font-extrabold text-3xl lg:text-4xl">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
