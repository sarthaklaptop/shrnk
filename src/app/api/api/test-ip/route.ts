import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get IP from various sources
  const clientIp = 
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';

  // Test IP-API with this IP
  let geoData = null;
  try {
    const response = await fetch(
      `http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,city,query,isp`,
      { signal: AbortSignal.timeout(3000) }
    );
    geoData = await response.json();
  } catch (error) {
    geoData = { error: "Failed to fetch geo data" };
  }

  return NextResponse.json({
    detectedIp: clientIp,
    geoData,
    headers: {
      'x-real-ip': request.headers.get('x-real-ip'),
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country'),
      'x-vercel-ip-city': request.headers.get('x-vercel-ip-city'),
    },
  });
}