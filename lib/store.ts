import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Album {
  id: string;
  title: string;
  date: string;
  selected?: boolean;
}

interface AlbumStore {
  albums: Album[];
  addAlbum: (album: Album) => void;
  setSelectedAlbum: (id: string) => void;
}
