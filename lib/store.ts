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

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set) => ({
      albums: [
        { id: "1", title: "入学式", date: "2023/4/1" },
        { id: "2", title: "函館旅行", date: "2024/3/9-2024/3/11" },
      ],
      addAlbum: (album) =>
        set((state) => ({
          albums: [...state.albums, album],
        })),
      setSelectedAlbum: (id) =>
        set((state) => ({
          albums: state.albums.map((album) => ({
            ...album,
            selected: album.id === id,
          })),
        })),
    }),
    {
      name: "album-storage",
    }
  )
);
