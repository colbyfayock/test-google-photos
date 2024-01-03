"use client";

import { CldUploadWidget as CldUploadWidgetDefault, CldUploadWidgetProps } from 'next-cloudinary';

const CldUploadWidget = (props: CldUploadWidgetProps) => {
  return <CldUploadWidgetDefault {...props} />
}

export default CldUploadWidget;