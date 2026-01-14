import { Clock } from "lucide-react";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import useInterviewStore from "../../store/useInterviewStore";

const Timer = ({ expiryTimestamp }) => {
  const { endInterview } = useInterviewStore();
  const { seconds, minutes, hours, start } = useTimer({
    expiryTimestamp,
    onExpire: endInterview,
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className="flex gap-2 items-center justify-center">
      <Clock size={20} />
      <div>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
};

export default Timer;
