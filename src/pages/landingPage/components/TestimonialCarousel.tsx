import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const TestimonialCarousel: React.FC = () => {
  const slides = [
    {
      quote:
        "PkayMNE cut our reporting time by 60% — now we actually act on the data.",
      author: "Amina — Program Director",
      org: "Ishowspeed Foundation",
    },
    {
      quote: "Beautiful dashboards. Field staff love the mobile forms.",
      author: "Mariam — Monitoring Lead",
      org: "Kai cenat Foundation",
    },
    {
      quote:
        "Automatic reports saved us countless hours and improved donor trust.",
      author: "Isaac — Grants Manager",
      org: "Mr.Beast Foundation",
    },
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-300">What our users say</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setIndex((i) => (i - 1 + slides.length) % slides.length)
            }
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.blockquote
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45 }}
          className="text-gray-200 italic text-lg"
        >
          “{slides[index].quote}”
          <footer className="mt-4 text-sm text-gray-400">
            — {slides[index].author},{" "}
            <span className="text-gray-300">{slides[index].org}</span>
          </footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialCarousel;
