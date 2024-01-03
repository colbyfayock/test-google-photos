import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const requestFormData = await request.formData()
  const file = requestFormData.get('file') as ( File | string );
  const tags = requestFormData.getAll('tags') || [];

  try {
    let results;

    if ( file instanceof Blob ) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      results = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          tags: [process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG]
        }, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
      });
    } else if ( typeof file === 'string' ) {
      results = await cloudinary.uploader.upload(file, {
        tags: [process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG, ...tags]
      });
    }

    return NextResponse.json(results);
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