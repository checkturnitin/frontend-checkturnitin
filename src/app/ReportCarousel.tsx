import { useState, useEffect, useRef } from "react";
import ReportImage from "./ReportImage"; // Import the new ReportImage component

const ReportCarousel: React.FC<{ onReportClick: (index: number) => void }> = ({ onReportClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reports = [
    "/assets/images/report1.png",
    "/assets/images/report2.png",
    "/assets/images/report3.png",
  ];

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reports.length);
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-8 flex justify-center items-center overflow-hidden">
      {reports.map((report, index) => (
        <ReportImage
          key={index}
          report={report}
          index={index}
          currentIndex={currentIndex}
          onClick={onReportClick}
        />
      ))}
    </div>
  );
};

export default ReportCarousel;
