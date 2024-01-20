import { NextResponse } from "next/server";
import webPush from "web-push";

webPush.setVapidDetails(
  "mailto:brandon@brandonhancock.io",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export async function POST(request: Request) {
  const { subscription, message } = await request.json();

  console.log("Sending push notification to", subscription, message);

  try {
    await webPush.sendNotification(subscription, message);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log("Error sending push notification", e);
    return NextResponse.json(
      { success: false, message: "error sending push notification." },
      { status: 500 }
    );
  }
}
