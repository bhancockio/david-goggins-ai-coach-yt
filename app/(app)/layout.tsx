"use client";

import { userThreadAtom } from "@/atoms";
import Navbar from "@/components/Navbar";
import { UserThread } from "@prisma/client";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [, setUserThread] = useAtom(userThreadAtom);

  useEffect(() => {
    async function getUserThread() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          userThread: UserThread;
        }>("/api/user-thread");

        if (!response.data.success || !response.data.userThread) {
          console.error(response.data.message ?? "Unknown error.");
          setUserThread(null);
          return;
        }

        setUserThread(response.data.userThread);
      } catch (error) {
        console.error(error);
        setUserThread(null);
      }
    }

    getUserThread();
  }, [setUserThread]);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}

// GOing to use the threadId to fetch all messages
