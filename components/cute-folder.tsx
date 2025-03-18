"use client"

import { cn } from "@/lib/utils"

interface CuteFolderProps {
  name: string
  count?: number
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export function CuteFolder({ name, count, onClick, className }: CuteFolderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-90",
        className,
      )}
      onClick={onClick}
    >
      <div className="mb-2 relative folder-icon">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow effect */}
          <path
            d="M13,18 L43,18 L53,8 L113,8 C118,8 123,13 123,18 L123,93 C123,98 118,103 113,103 L13,103 C8,103 3,98 3,93 L3,28 C3,23 8,18 13,18 Z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(3,3)"
          />
          {/* Main folder */}
          <path
            d="M10,15 L40,15 L50,5 L110,5 C115,5 120,10 120,15 L120,90 C120,95 115,100 110,100 L10,100 C5,100 0,95 0,90 L0,25 C0,20 5,15 10,15 Z"
            fill="#f8a8b8"
            stroke="#000"
            strokeWidth="2"
          />
          {/* Folder shine */}
          <path
            d="M10,15 L40,15 L50,5 L110,5 C115,5 120,10 120,15 L120,30 C60,30 30,25 10,25 C5,25 0,20 0,25 L0,25 C0,20 5,15 10,15 Z"
            fill="rgba(255,255,255,0.3)"
            stroke="none"
          />
        </svg>
        {count !== undefined && (
          <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-0.5 text-xs font-medium shadow-sm border border-gray-200">
            {count}
          </div>
        )}
      </div>
      <span className="text-center text-gray-700 font-medium">{name}</span>
    </div>
  )
}

