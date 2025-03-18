"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateAlbumDialog } from "@/components/create-album-dialog";
import { useAlbumStore } from "@/lib/store";
import { getFoldersForAlbum } from "@/lib/services/folder-service";
import { Logo } from "@/components/logo";
import { CuteFolder } from "@/components/cute-folder";



type Params = {
  id: string;
};

export default function AlbumPage({
  params,
}: {
  params: Promise<{ id: string; folderId: string }>;
}) {
  const unwrapParams = use(params);
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { albums, addAlbum, setSelectedAlbum } = useAlbumStore();

  // Update selected album when the page loads
  useEffect(() => {
    setSelectedAlbum(unwrapParams.id);
  }, [unwrapParams.id, setSelectedAlbum]);

  // Fetch folders when the album ID changes
  useEffect(() => {
    const loadFolders = async () => {
      setIsLoading(true);
      try {
        const folderData = await getFoldersForAlbum(unwrapParams.id);
        setFolders(folderData);
      } catch (error) {
        console.error("Error loading folders:", error);
        // Set default folders in case of error
        setFolders([
          { id: "smile", name: "Smile" },
          { id: "cry", name: "Cry" },
          { id: "funny", name: "Funny" },
          { id: "normal", name: "Normal" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFolders();
  }, [unwrapParams.id]);

  // Get album title based on ID
  const getAlbumTitle = (id: string) => {
    const album = albums.find((a) => a.id === id);
    return album ? album.title : "アルバム";
  };

  const albumTitle = getAlbumTitle(unwrapParams.id);

  // Handle folder click
  const handleFolderClick = (folderId: string) => {
    router.push(`/album/${unwrapParams.id}/folder/${folderId}`);
  };

  // Handle album creation
  const handleAlbumCreate = (newAlbum: any) => {
    addAlbum(newAlbum);
  };

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
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/album/${album.id}`}
                  className={cn(
                    "card-cute block w-full rounded-md p-4 text-left",
                    album.selected
                      ? "bg-[#e8a0b0] hover:bg-[#e090a0]"
                      : "bg-[#f0c0d0] hover:bg-[#e8b0c0]"
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
            <Link href="/" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link
              href={`/album/${unwrapParams.id}`}
              className="text-xl font-medium hover:underline"
            >
              {albumTitle}
            </Link>
            <span className="mx-1 text-xl font-medium">&gt;</span>
          </div>
          <Logo size="small" />
        </div>

        {/* Folder grid */}
        <div className="grid grid-cols-2 gap-8 p-6">
          {isLoading ? (
            // Loading state
            <>
              <div className="flex flex-col items-center">
                <div className="mb-2 relative bg-gray-200 animate-pulse w-[120px] h-[100px] rounded-md"></div>
                <span className="text-center text-gray-400 bg-gray-200 animate-pulse w-16 h-5 rounded"></span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 relative bg-gray-200 animate-pulse w-[120px] h-[100px] rounded-md"></div>
                <span className="text-center text-gray-400 bg-gray-200 animate-pulse w-16 h-5 rounded"></span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 relative bg-gray-200 animate-pulse w-[120px] h-[100px] rounded-md"></div>
                <span className="text-center text-gray-400 bg-gray-200 animate-pulse w-16 h-5 rounded"></span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 relative bg-gray-200 animate-pulse w-[120px] h-[100px] rounded-md"></div>
                <span className="text-center text-gray-400 bg-gray-200 animate-pulse w-16 h-5 rounded"></span>
              </div>
            </>
          ) : (
            // Loaded folders
            folders.map((folder) => (
              <CuteFolder
                key={folder.id}
                name={folder.name}
                count={folder.count}
                onClick={() => handleFolderClick(folder.id)}
                className="animate-float"
                style={{ animationDelay: `${folders.indexOf(folder) * 0.2}s` }}
              />
            ))
          )}
        </div>

        {/* Main content scroll indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-10"></div>
      </div>

      {/* Create Album Dialog */}
      <CreateAlbumDialog
        open={createAlbumOpen}
        onOpenChange={setCreateAlbumOpen}
        onAlbumCreate={handleAlbumCreate}
      />
    </div>
  );
}
