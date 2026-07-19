import { NextRequest, NextResponse } from "next/server";

// Proxies reverse geocoding to Nominatim server-side so we can set a proper
// identifying User-Agent (required by Nominatim's usage policy) and keep the
// request same-origin for the client, rather than calling it from the browser.
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");

  const latNum = parseFloat(lat || "");
  const lngNum = parseFloat(lng || "");

  if (isNaN(latNum) || isNaN(lngNum)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latNum}&lon=${lngNum}&zoom=18&addressdetails=0`,
      {
        headers: {
          "User-Agent": "RescueGO-MY/1.0 (roadside assistance app; contact@rescuego.my)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ address: null });
    }

    const data = await res.json();
    return NextResponse.json({ address: data?.display_name || null });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json({ address: null });
  }
}
