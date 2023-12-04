'use client';

import Dropzone from '@/components/Dropzone';
import { CloudinaryResource } from '@/types/cloudinary';

interface UploadProps {
  className?: string;
  onSuccess?: Function;
}

const Upload = ({ className, onSuccess }: UploadProps) => {

  async function handleOnDrop(files: Array<File>) {
    const uploads: Array<CloudinaryResource> = await Promise.all(files.map(async file => {
      const formData = new FormData();
      
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json();

      return data;
    }));

    if ( typeof onSuccess === 'function' ) {
      onSuccess(uploads)
    }
  }

  return (
    <Dropzone className={className} onDrop={handleOnDrop} />
  )
}

export default Upload;