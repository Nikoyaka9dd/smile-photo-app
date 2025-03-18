import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large" | "custom"
}

export function Logo({ className = "", size = "custom" }: LogoProps) {
  const sizes = {
    small: { width: 120, height: 40 },
    medium: { width: 180, height: 60 },
    large: { width: 240, height: 80 },
    custom: { width: 360, height: 120},
  }

  const { width, height } = sizes[size]

  return (
    <Link href="/" className={className}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E7%84%A1%E9%A1%8C103_20250317140559.PNG-yzC1iclfQQ4YyxhfBFcjacNK9KgA46.png"
        alt="SmilePhoto - 思い返そう、あの笑顔"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  )
}

