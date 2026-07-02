// GET /api/stores — List all stores, optionally sorted by proximity
// Query params: ?lat=-8.65&lng=115.22&radius=5

import db from "@/db";
import { stores } from "@/db/schema";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = parseFloat(searchParams.get("radius") || "10");

  const allStores = await db.select().from(stores).all();

  // Parse kategori JSON for all stores
  const parsed = allStores.map((store) => ({
    ...store,
    kategori: JSON.parse(store.kategori) as string[],
  }));

  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // Calculate distance and filter by radius
    const withDistance = parsed
      .map((store) => {
        const jarak_km = haversineDistance(
          userLat,
          userLng,
          store.latitude,
          store.longitude
        );
        return {
          ...store,
          jarak_km,
          jarak: `${jarak_km.toFixed(1)} km`,
        };
      })
      .filter((store) => store.jarak_km <= radiusKm)
      .sort((a, b) => a.jarak_km - b.jarak_km);

    return Response.json({ stores: withDistance, total: withDistance.length });
  }

  return Response.json({ stores: parsed, total: parsed.length });
}
