import { v2 as cloudinary } from 'cloudinary';

import MediaViewer from '@/components/MediaViewer';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function Image({ params }: { params: { publicId: string } }) {
  const { publicId } = params;

  const resource = await cloudinary.api.resource(publicId, {
    context: true
  });
  
  return <MediaViewer resource={resource} />;
}

export default Image;
