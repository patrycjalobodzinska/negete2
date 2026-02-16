import { getCachedPublishedBlogCount } from "@/sanity/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await getCachedPublishedBlogCount();
  return NextResponse.json({ count });
}
