"use client";
import useSWR from 'swr'
 
type Isrand = {
    message: string;
  };

async function fetcher(key: string) {
    return fetch(key).then((res) => res.json() as Promise<Isrand | null>);
  }

export default function Page(){
    const { data, error, isLoading } = useSWR('https://5905-126-158-191-212.ngrok-free.app/', fetcher)
 
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data!.message}!</div>
};

