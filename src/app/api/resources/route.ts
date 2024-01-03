import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const { resources } = await cloudinary.api.resources_by_tag(String(process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG), { context: true });

    return NextResponse.json({
      data: resources
    });
  } catch(error) {
    let message = 'Unknown Error';

    if ( error instanceof Error ) {
      message = error.message;
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500
    })
  }
}