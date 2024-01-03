import { NextResponse } from 'next/server'

import { createHashFromString } from '@/lib/util';

export async function POST(request: Request) {
  // const requestFormData = await request.formData()
  // const assets = requestFormData.get('assets');
  const timestamp = Date.now();

  const formData = new FormData();

  const parameters: { [key: string]: string } = {
    public_id: 'test_collage',
    resource_type: 'image',
    manifest_json: JSON.stringify({
      "template": "grid",
      "width": 500,
      "height": 500,
      "columns": 3,
      "rows": 3,
      "spacing": 1,
      "color": "blue",
      "assetDefaults": {
        "kind": "upload",
        "crop": "fill",
        "gravity": "auto"
      },
      "assets": [
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" },
        { "media": "uxcul1rljbzv53thdel9" }
      ]
    })
  };

  Object.keys(parameters).sort().forEach(key => {
    if (typeof parameters[key] === 'undefined') return;
    formData.append(key, parameters[key]);
  });

  const paramsString = Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&');

  const paramsHash = await createHashFromString(`${paramsString}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`);

  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
  formData.append('timestamp', String(timestamp));
  formData.append('signature', paramsHash);

  try {
    const result = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/create_collage`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    return NextResponse.json(result);
  } catch (error) {
    let message = 'Unknown Error';

    if (error instanceof Error) {
      message = error.message;
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500
    })
  }
}