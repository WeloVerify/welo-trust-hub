
import React from 'react';

interface LogoHeaderProps {
  className?: string;
}

const LogoHeader = ({ className = "" }: LogoHeaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">W</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          WELO
        </span>
      </div>
    </div>
  );
};

export default LogoHeader;
