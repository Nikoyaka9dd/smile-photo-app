"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CreateAlbumDialog } from "@/components/create-album-dialog"
import { useAlbumStore } from "@/lib/store"
import { Logo } from "@/components/logo"

export default function SmilePhotoApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const { albums, addAlbum } = useAlbumStore()

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((ref) => ref === entry.target)
            if (index !== -1 && !visibleSections.includes(index)) {
              setVisibleSections(prev => [...prev, index])
            }
          }
        })
      },
      { threshold: 0.1 }
    )
  
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
  
    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [visibleSections])

  // Handle album creation
  const handleAlbumCreate = (newAlbum: any) => {
    addAlbum(newAlbum)
  }

  const photoSections = [
    {
      id: "family",
      image: "/placeholder.svg?height=200&width=300",
      alt: "",
    },
    {
      id: "snowboard",
      image: "/placeholder.svg?height=200&width=300",
      alt: "",
    },
    {
      id: "kimono",
      image: "/placeholder.svg?height=200&width=300",
      alt: "",
    },
    {
      id: "baby",
      image: "/placeholder.svg?height=200&width=300",
      alt: "",
    },
    {
      id: "cones",
      image: "/placeholder.svg?height=200&width=300",
      alt: "",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={cn(
          "relative flex flex-col bg-[#f8d7e0] transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-0" : "w-64",
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-8 top-6 z-10 rounded-r-full bg-[#f8d7e0] p-2 shadow-md hover:bg-[#f0c0d0] transition-all duration-300"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 p-4 h-full">
            <Button
              variant="secondary"
              className="btn-cute flex items-center gap-2 bg-[#f8d7e0] hover:bg-[#f0c0d0] text-black"
              onClick={() => setCreateAlbumOpen(true)}
            >
              <Plus className="h-4 w-4" />
              アルバム新規作成
            </Button>

            <div className="mt-4 flex flex-col gap-2 sidebar-scrollbar pr-2 max-h-[calc(100vh-120px)]">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/album/${album.id}`}
                  className={cn(
                    "card-cute block w-full rounded-md p-4 text-left",
                    album.selected ? "bg-[#e8a0b0] hover:bg-[#e090a0]" : "bg-[#f0c0d0] hover:bg-[#e8b0c0]",
                  )}
                >
                  <div className="text-xs text-gray-600">{album.date}</div>
                  <div className="font-medium">{album.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-10"></div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="pr-0">
          {/* Logo */}
          <div className="mb-4 flex justify-end pr-0">
            <div className="text-right">
              <Logo size="custom" />
            </div>
          </div>

          {/* Main heading */}
          <div
          ref={(el) => { sectionRefs.current[0] = el }}
            className={cn(
              "mb-8 transform transition-all duration-500",
              visibleSections.includes(0) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <div className="flex items-start justify-center pb-12">
              <div className="max-w-2xl w-full text-center">
                <h2 className="mb-4 text-5xl font-bold">思い返そう、あの笑顔</h2>
                <p className="mb-2 text-2xl">友達との旅行、お子様の成長記録......</p>
                <p className="mb-2 text-2xl">
                  大切な写真を、AIと一緒に楽に整理しましょう。
                </p>
                <p className="mb-2 text-2xl text-gray-600">
                  <br />
                  SmilePhotoはAIによる表情分析で
                  <br />
                  感情ごとに写真を整理することができます。
                </p>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              ref={(el) => { sectionRefs.current[1] = el }}
              className={cn(
                "transform transition-all duration-500 delay-100",
                 visibleSections.includes(1) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
            >
              <div className="card-cute overflow-hidden rounded-lg">
                <Image
                  src="/images/partyHFKE0880_TP_V.jpg"
                  alt="家族の食事の写真"
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
              ref={(el) => { sectionRefs.current[2] = el }}
                className={cn(
                  "transform transition-all duration-500 delay-200",
                  visibleSections.includes(2) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                )}
              >
                <div className="card-cute overflow-hidden rounded-lg">
                  <Image
                    src="/images/medama458A9913_TP_V.jpg"
                    alt="謎の男"
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
              </div>

              <div
              ref={(el) => { sectionRefs.current[3] = el }}
                className={cn(
                  "transform transition-all duration-500 delay-300",
                  visibleSections.includes(3) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                )}
              >
                <div className="card-cute overflow-hidden rounded-lg">
                  <Image
                    src="/images/OOKPAR563461612_TP_V.jpg"
                    alt="確定申告が終わらない"
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div
            ref={(el) => { sectionRefs.current[4] = el }}
              className={cn(
                "transform transition-all duration-500 delay-400",
                visibleSections.includes(4) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
            >
              <div className="card-cute overflow-hidden rounded-lg">
                <Image
                  src="/images/babyFTHG7523_TP_V.jpg"
                  alt="泣くなよベイビー"
                  width={300}
                  height={300}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
            </div>

            <div
            ref={(el) => { sectionRefs.current[5] = el }}
              className={cn(
                "transform transition-all duration-500 delay-500",
                visibleSections.includes(5) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
            >
              <div className="card-cute overflow-hidden rounded-lg">
                <Image
                  src="/images/susiueseii-PAR50051-8988_TP_V.jpg"
                  alt="カラフルなコーンをかぶった人々の写真"
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Create album button (bottom) */}
          <div
            ref={(el) => {
              sectionRefs.current[6] = el;
            }}
            className={cn(
              "mt-8 flex justify-center transform transition-all duration-500 delay-600",
              visibleSections.includes(6) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            )}
          >
            <Button
              className="btn-cute flex w-full max-w-md items-center justify-center gap-2 bg-[#f8d7e0] text-black hover:bg-[#f0c0d0]"
              onClick={() => setCreateAlbumOpen(true)}
            >
              <Plus className="h-4 w-4" />
              アルバム新規作成
            </Button>
          </div>
        </div>

        {/* Main content scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-10"></div>
      </div>

      {/* Create Album Dialog */}
      <CreateAlbumDialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen} onAlbumCreate={handleAlbumCreate} />
    </div>
  )
}

