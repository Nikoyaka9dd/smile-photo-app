"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreateAlbumDialog } from "@/components/create-album-dialog";
import { getFoldersForAlbum } from "@/lib/services/folder-service";
import { Logo } from "@/components/logo";
import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";
import { Folders } from "../../page";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Sample photos for all folders
const samplePhotos: Photo[] = [];

// Fix the type definition to match Next.js expectations
type Params = {
  id: string;
  folderId: string;
};

type Folder = {
  album_id: string;
  category: string;
  images: string[];
};

export default function FolderPage({
  params,
}: {
  params: Promise<{ id: string; folderId: string }>;
}) {
  const unwrapParams = use(params);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<any | null>(null);
  // TODO: 画像と割り振り先のフォルダをGETしてゴニョゴニョ
  const emotion = useParams<{ id: string; folderId: string }>();

  const {
    data: folder,
    error,
    isLoading,
  } = useSWR<Folder>(
    `https://smilephoto.wsnet.jp/images/${emotion.id}/${emotion.folderId}`,
    fetcher
  );

  const { data: allFolder, isValidating } = useSWR<Folders>(
    `https://smilephoto.wsnet.jp/albums`,
    fetcher
  );
  console.log("🐣", folder);

  // APIを叩く動作を作るぞ

  // Update selected album when the page loads

  // Fetch folder information
  useEffect(() => {
    const loadFolderInfo = async () => {
      try {
        const folders = await getFoldersForAlbum(unwrapParams.id);
        const folder = folders.find((f: any) => f.id === unwrapParams.folderId);
        if (folder) {
          setCurrentFolder(folder);
        }
      } catch (error) {
        console.error("Error loading folder info:", error);
      }
    };

    loadFolderInfo();
  }, [unwrapParams.id, unwrapParams.folderId]);

  const folderName = currentFolder?.name || unwrapParams.folderId;

  // Handle album creation
  const handleAlbumCreate = (newAlbum: any) => {
    console.log("アルバム作成");
  };

  if (isLoading) {
    return <div>ちょっと待ってね...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={cn(
          "relative flex flex-col bg-[#f8d7e0] transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-0" : "w-64"
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-8 top-6 z-10 rounded-r-full bg-[#f8d7e0] p-2 shadow-md hover:bg-[#f0c0d0] transition-all duration-300"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
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
              {allFolder?.albums.map((album) => (
                <Link
                  key={album.album_id}
                  href={`/album/${album.album_id}`}
                  className={cn(
                    "card-cute block w-full rounded-md p-4 text-left"
                    // album.selected
                    //   ? "bg-[#e8a0b0] hover:bg-[#e090a0]"
                    //   : "bg-[#f0c0d0] hover:bg-[#e8b0c0]"
                  )}
                >
                  {/* <div className="text-xs text-gray-600">{album.date}</div> */}
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
            <Link
              href={`/album/${unwrapParams.id}`}
              className="text-xl font-medium hover:underline"
            >
              {/* ここに今見ているアルバムのtitleが入る */}
              {allFolder?.albums.find(
                (album) => album.album_id === unwrapParams.id
              )?.title || "アルバム"}
            </Link>
            <span className="mx-1 text-xl font-medium">&gt;</span>
            <span className="text-xl font-medium">{folderName}</span>
          </div>
          <Logo size="large" />
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {folder?.images?.map((photo) => (
            <div key={photo} className="col-span-1 group relative">
              <div className="card-cute overflow-hidden rounded-lg">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={photo}
                  width={50}
                  height={50}
                  className="w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                <Heart className="h-4 w-4 text-pink-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Main content scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-10"></div>
      </div>

      {/* Create Album Dialog */}
      <CreateAlbumDialog
        open={createAlbumOpen}
        onOpenChange={setCreateAlbumOpen}
      />
    </div>
  );
}
