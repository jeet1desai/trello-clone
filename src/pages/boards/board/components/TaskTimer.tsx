import React, { useEffect, useState, useRef } from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { start } from 'repl';

dayjs.extend(duration);

const { Text } = Typography;

interface TaskTimerProps {
  isTimerActive: boolean;
  actualTimeSpent: number;
  startTime: Date;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ isTimerActive, actualTimeSpent, startTime }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerActive) {
      let finalTime = 0;
      const currentElapsed = new Date().getTime() - new Date(startTime).getTime();
      finalTime = actualTimeSpent ? Number(actualTimeSpent) + currentElapsed : currentElapsed;
      setElapsedSeconds(Math.floor(finalTime / 1000));

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(Math.floor(actualTimeSpent / 1000));
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerActive, actualTimeSpent]);

  const formatTime = (seconds: number) => {
    const dur = dayjs.duration(seconds, 'seconds');
    return dur.format('HH:mm:ss');
  };

  return (
    <Text strong style={{ fontSize: 16 }}>
      {formatTime(elapsedSeconds)}
    </Text>
  );
};

export default TaskTimer; 