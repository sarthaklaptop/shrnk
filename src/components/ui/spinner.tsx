import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "text-[20px]",
    md: "text-[28px]",
    lg: "text-[40px]",
  };

  return (
    <div
      className={`relative inline-block ${sizeClasses[size]} ${className}`}
      style={{ width: "1em", height: "1em" }}
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute left-[0.4629em] bottom-0 w-1 h-1 rounded-[0.0555em] bg-red-600"
          style={{
            transformOrigin: "center -0.2222em",
            transform: `rotate(${i * 30}deg)`,
            animation: `spinnerFade 1s infinite linear`,
            animationDelay: `${i * 0.083}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes spinnerFade {
          0% {
            background-color: #f56565;
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}

// Centered version for full-page loading
export function SpinnerCenter({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Spinner size={size} />
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-red-400 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && <p className="text-red-700 font-medium">{message}</p>}
      </div>
    </div>
  );
}