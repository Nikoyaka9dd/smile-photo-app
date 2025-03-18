interface FolderIconProps {
  className?: string
}

export function FolderIcon({ className }: FolderIconProps) {
  return (
    <svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10,15 L40,15 L50,5 L110,5 C115,5 120,10 120,15 L120,90 C120,95 115,100 110,100 L10,100 C5,100 0,95 0,90 L0,25 C0,20 5,15 10,15 Z"
        fill="#f8a8b8"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  )
}

