import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Album {
  id: string
  title: string
  date: string
  selected?: boolean
}

interface AlbumStore {
  albums: Album[]
  addAlbum: (album: Album) => void
  setSelectedAlbum: (id: string) => void
}

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set) => ({
      albums: [
        { id: "1", title: "函館旅行", date: "2023/3/9-2023/3/11" },
        { id: "2", title: "関西ビギナー旅行", date: "2023/3/7-2023/3/10" },
        { id: "3", title: "ビギナーズハッカソン", date: "yyyy/mm/dd" },
        { id: "4", title: "---", date: "yyyy/mm/dd" },
        { id: "5", title: "---", date: "yyyy/mm/dd" },
        { id: "6", title: "---", date: "yyyy/mm/dd" },
        { id: "7", title: "---", date: "yyyy/mm/dd" },
        { id: "8", title: "---", date: "yyyy/mm/dd" },
        { id: "9", title: "---", date: "yyyy/mm/dd" },
        { id: "10", title: "---", date: "yyyy/mm/dd" },
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
    },
  ),
)

