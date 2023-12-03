import React, { useState, useEffect } from 'react';

interface CircleProgressBarProps {
    duration: number
}

export const GameCount: React.FC<CircleProgressBarProps> = ({ duration }) => {
  const [radius, setRadius] = useState(40); // Adjust the radius as needed
  const [circumference, setCircumference] = useState(2 * Math.PI * radius);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {

    const startTime = Date.now();

    const updatePercentage = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration * 1000) {
        const progress = (elapsedTime / (duration * 1000)) * 100;
        setPercentage(progress);
        requestAnimationFrame(updatePercentage);
        
      } else {
        setPercentage(100);
      }
    };

    updatePercentage();

    return () => {
      // Cleanup if needed
    };
  }, [radius, duration]);

  const startingAngle = 0; // Starting angle in degrees

  const adjustedOffset = circumference - (percentage / 100) * circumference + (startingAngle / 360) * circumference;


  return (
    <div style={{ width: '100px', margin: 'auto' }}>
      <svg height="100" width="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#3f51b5"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#4caf50"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={adjustedOffset}
        />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="16" fill="#3f51b5">
          {`${Math.round(percentage / 20)} sec`}
        </text>
      </svg>
    </div>
  );
};