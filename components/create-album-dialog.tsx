"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, X, ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import type { Album } from "@/lib/store";
import axios from "axios";
import { useRouter } from "next/navigation";

// Fix the TypeScript error with the directory attribute by adding a custom type declaration
declare module "react" {
  interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    // Add support for the non-standard directory attribute
    directory?: string;
    webkitdirectory?: string;
  }
}

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAlbumCreate: (album: Album) => void;
}

export function CreateAlbumDialog({
  open,
  onOpenChange,
  onAlbumCreate,
}: CreateAlbumDialogProps) {
  const [albumName, setAlbumName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleBrowseFolderClick = () => {
    dirInputRef.current?.click();
  };

  const handleCreateAlbum = () => {
    // Format the date range
    const dateRange =
      startDate && endDate
        ? `${startDate.replace(/-/g, "/")}${
            endDate ? `-${endDate.replace(/-/g, "/")}` : ""
          }`
        : "yyyy/mm/dd";

    const fieldId = Date.now().toString();

    // Create a new album object
    const newAlbum = {
      id: fieldId, // Generate a unique ID based on timestamp
      title: albumName,
      date: dateRange,
    };

    const formData = new FormData();
    formData.append("title", "ho");
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
    });
    formData.append("id", fieldId);

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, {
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else {
        console.log(key, value);
      }
    }
    console.log("formDAta", formData);
    console.log("newAlbum", newAlbum);

    axios
      .post("https://5905-126-158-191-212.ngrok-free.app//upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Call the callback to add the album to the list
    onAlbumCreate(newAlbum);

    // Close the dialog
    onOpenChange(false);

    // Reset form
    setAlbumName("");
    setStartDate("");
    setEndDate("");
    setSelectedFiles([]);

    router.push(`/album/${fieldId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>アルバム新規作成</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="album-name" className="text-sm font-medium">
              アルバム名
            </label>
            <input
              id="album-name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="アルバム名を入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="album-date" className="text-sm font-medium">
              日付
            </label>
            <div className="flex items-center gap-2">
              <input
                id="album-date-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span>-</span>
              <input
                id="album-date-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* File upload area */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">写真をインポート</label>
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                isDragging ? "border-pink-400 bg-pink-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
              <input
                type="file"
                ref={dirInputRef}
                onChange={handleDirChange}
                className="hidden"
                webkitdirectory="true"
                directory=""
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  ここに写真またはフォルダをドラッグ＆ドロップ
                </p>
                <p className="text-xs text-gray-500">または</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseClick}
                    className="text-xs"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    写真を選択
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseFolderClick}
                    className="text-xs"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    フォルダを選択
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  選択された写真 ({selectedFiles.length})
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFiles([])}
                  className="h-8 px-2 text-xs"
                >
                  すべてクリア
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        {file.type.startsWith("image/") ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            className="bg-[#f8d7e0] text-black hover:bg-[#f0c0d0]"
            onClick={handleCreateAlbum}
            disabled={!albumName || selectedFiles.length === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            作成
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
