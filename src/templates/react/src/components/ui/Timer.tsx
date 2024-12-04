// create the timer component
import { useEffect, useState } from "react";

interface TimerProps {
  onComplete: () => void;
  duration?: number;
}

const Timer: React.FC<TimerProps> = ({ onComplete, duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onComplete]);

  return (
    <div className="text-center text-red-500">
      {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "You can resend the code now"}
    </div>
  );
};

export default Timer;