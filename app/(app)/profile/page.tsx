import ProfileContainer from "@/components/ProfileContainer";
import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import React from "react";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    throw new Error("No user");
  }

  let challengePreferences = await prismadb.challengePreferences.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!challengePreferences) {
    challengePreferences = await prismadb.challengePreferences.create({
      data: {
        userId: user.id,
        challengeId: "EASY",
      },
    });
  }

  return (
    <div className="max-w-screen-lg m-10 lg:mx-auto">
      <ProfileContainer challengePreferences={challengePreferences} />
    </div>
  );
}
