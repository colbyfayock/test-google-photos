import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const requestFormData = await request.formData()
  const publicId = requestFormData.get('publicId') as string;
  const file = requestFormData.get('file') as ( File | string );
  const tags = requestFormData.getAll('tags') as Array<string> || [];

  try {
    let results;

    const uploadOptions: Record<string, string | Array<string> | boolean> = {
      tags: [String(process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG), ...tags]
    };

    if ( typeof publicId === 'string' ) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
      uploadOptions.invalidate = true;
    }

    if ( file instanceof Blob ) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      results = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(uploadOptions, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
      });
    } else if ( typeof file === 'string' ) {
      console.log('file', file)
      console.log('uploadOptions', uploadOptions)
      results = await cloudinary.uploader.upload(file, uploadOptions);
      console.log('after')
    }

    return NextResponse.json(results);
  } catch(error) {
    console.log('error', error)
    let message = 'Unknown Error';

    if ( error instanceof Error ) {
      message = error.message;
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500
    })
  }
}