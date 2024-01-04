import { v2 as cloudinary } from 'cloudinary';

import MediaLibrary from '@/components/MediaLibrary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function Home() {
  const { resources } = await cloudinary.api.resources_by_tag(String(process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG), {
    max_results: 50,
    context: true
  });
  return <MediaLibrary resources={resources} />
}

export default Home;
