"use client";

import { assistantAtom, userThreadAtom } from "@/atoms";
import Navbar from "@/components/Navbar";
import NotificationModal from "@/components/NotificationModal";
import useServiceWorker from "@/hooks/useServiceWorker";
import { Assistant, UserThread } from "@prisma/client";
import axios from "axios";
import { useAtom } from "jotai";
import { use, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Atom State
  const [, setUserThread] = useAtom(userThreadAtom);
  const [assistant, setAssistant] = useAtom(assistantAtom);

  // State
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);

  // Hooks
  useServiceWorker();

  useEffect(() => {
    if (assistant) return;

    async function getAssistant() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          assistant: Assistant;
        }>("/api/assistant");

        if (!response.data.success || !response.data.assistant) {
          console.error(response.data.message ?? "Unknown error.");
          toast.error("Failed to fetch assistant.");
          setAssistant(null);
          return;
        }

        setAssistant(response.data.assistant);
      } catch (error) {
        console.error(error);
        setAssistant(null);
      }
    }

    getAssistant();
  }, [assistant, setAssistant]);

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

  useEffect(() => {
    if ("Notification" in window) {
      setIsNotificationModalVisible(Notification.permission === "default");
      console.log("Notification permission:", Notification.permission);
    }
  }, []);

  const saveSubscription = useCallback(async () => {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    try {
      const response = await axios.post("/api/subscription", subscription);

      if (!response.data.success) {
        console.error(response.data.message ?? "Unknown error.");
        toast.error("Failed to save subscription.");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save subscription.");
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      if (Notification.permission === "granted") {
        saveSubscription();
      }
    }
  }, [saveSubscription]);

  const handleNotificationModalClose = (didConstent: boolean) => {
    setIsNotificationModalVisible(false);

    if (didConstent) {
      toast.success("You will now receive notifications.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
      {isNotificationModalVisible && (
        <NotificationModal
          onRequestClose={handleNotificationModalClose}
          saveSubscription={saveSubscription}
        />
      )}
      <Toaster />
    </div>
  );
}
