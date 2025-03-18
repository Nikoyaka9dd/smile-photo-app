"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Plus, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CreateAlbumDialog } from "@/components/create-album-dialog"
import { useAlbumStore } from "@/lib/store"
import { getFoldersForAlbum } from "@/lib/services/folder-service"
import { Logo } from "@/components/logo"

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

// Sample photos for all folders
const samplePhotos: Photo[] = []

// Fix the type definition to match Next.js expectations
type Params = {
  id: string
  folderId: string
}

export default function FolderPage({
  params,
}: {
  params: Promise<{ id: string, folderId: string }>
}) {
  const unwrapParams = use(params);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<any | null>(null)
  const { albums, addAlbum, setSelectedAlbum } = useAlbumStore()
  console.log(unwrapParams.id);

  // Update selected album when the page loads
  useEffect(() => {
    setSelectedAlbum(unwrapParams.id)
  }, [unwrapParams.id, setSelectedAlbum])

  // Fetch folder information
  useEffect(() => {
    const loadFolderInfo = async () => {
      try {
        const folders = await getFoldersForAlbum(unwrapParams.id)
        const folder = folders.find((f: any) => f.id === unwrapParams.folderId)
        if (folder) {
          setCurrentFolder(folder)
        }
      } catch (error) {
        console.error("Error loading folder info:", error)
      }
    }

    loadFolderInfo()
  }, [unwrapParams.id, unwrapParams.folderId])

  // Get album title based on ID
  const getAlbumTitle = (id: string) => {
    const album = albums.find((a) => a.id === id)
    return album ? album.title : "アルバム"
  }

  const albumTitle = getAlbumTitle(unwrapParams.id)
  const folderName = currentFolder?.name || unwrapParams.folderId

  // Handle album creation
  const handleAlbumCreate = (newAlbum: any) => {
    addAlbum(newAlbum)
  }

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
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/album/${unwrapParams.id}`} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link href={`/album/${unwrapParams.id}`} className="text-xl font-medium hover:underline">
              {albumTitle}
            </Link>
            <span className="mx-1 text-xl font-medium">&gt;</span>
            <span className="text-xl font-medium">{folderName}</span>
          </div>
          <Logo size="large"/>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {samplePhotos.map((photo) => (
            <div key={photo.id} className="col-span-1 group relative">
              <div className="card-cute overflow-hidden rounded-lg">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                <Heart className="h-4 w-4 text-pink-500" />
              </button>
              <div className="mt-2 text-sm text-gray-600">{photo.alt}</div>
            </div>
          ))}
        </div>

        {/* Main content scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-10"></div>
      </div>

      {/* Create Album Dialog */}
      <CreateAlbumDialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen} onAlbumCreate={handleAlbumCreate} />
    </div>
  )
}

