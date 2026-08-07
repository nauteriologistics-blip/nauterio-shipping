import React from "react";

export function SailMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M28 5 C28 5 14 25 8 35 L28 35 Z" fill="currentColor" />
      <path
        d="M4 37 C11 42 15 33 23 34 C29 35 34 30 41 31"
        stroke="#F28C18"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({
  theme = "light",
  className = "",
}: {
  theme?: "light" | "dark";
  className?: string;
}) {
  const inkColor = theme === "dark" ? "text-white" : "text-[#081F3D]";
  const subColor = theme === "dark" ? "text-slate-300" : "text-slate-500";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <SailMark className={`w-9 h-9 shrink-0 ${inkColor}`} />
      <div className="flex flex-col leading-none">
        <span className={`text-2xl font-black tracking-tight ${inkColor}`}>
          Nauterio
        </span>
        <span className={`text-[10px] tracking-[0.25em] uppercase font-semibold ${subColor}`}>
          Logistics
        </span>
      </div>
    </div>
  );
}
