import { motion } from "framer-motion";

interface ReportImageProps {
  report: string;
  index: number;
  currentIndex: number;
  onClick: (index: number) => void;
}

const ReportImage: React.FC<ReportImageProps> = ({ report, index, currentIndex, onClick }) => {
  return (
    <motion.div
      key={index}
      className={`absolute transition-opacity duration-500 ease-in-out ${
        index === currentIndex ? "opacity-100" : "opacity-30"
      }`}
      style={{
        transform: `translateX(${(index - currentIndex) * 100}%)`,
        flex: "0 0 100%",
        zIndex: index === currentIndex ? 10 : 1,
      }}
    >
      <motion.img
        src={report}
        alt={`Report ${index + 1}`}
        className="rounded-lg shadow-lg cursor-pointer w-full object-contain"
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.3 },
        }}
        onClick={() => onClick(index)}
      />
    </motion.div>
  );
};

export default ReportImage;
