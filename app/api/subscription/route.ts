import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, messages: "Unauthorized" },
      { status: 401 }
    );
  }

  const { endpoint, keys } = await request.json();
  if (!endpoint || !keys) {
    return NextResponse.json(
      { success: false, messages: "Invalid request" },
      { status: 400 }
    );
  }

  const existingUserMeta = await prismadb.userMeta.findUnique({
    where: { userId: user.id },
  });

  console.log("existingUserMeta", existingUserMeta);

  try {
    if (existingUserMeta) {
      await prismadb.userMeta.update({
        where: {
          userId: user.id,
        },
        data: {
          endpoint,
          auth: keys.auth,
          p256dh: keys.p256dh,
        },
      });
    } else {
      await prismadb.userMeta.create({
        data: {
          userId: user.id,
          endpoint,
          auth: keys.auth,
          p256dh: keys.p256dh,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, message: "Error creating/updating user meta" },
      { status: 500 }
    );
  }
}
