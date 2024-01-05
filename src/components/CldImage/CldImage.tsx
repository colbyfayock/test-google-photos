"use client";

import { CldImage as CldImageDefault, CldImageProps } from 'next-cloudinary';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#e8e8e8" offset="20%" />
        <stop stop-color="#efefef" offset="50%" />
        <stop stop-color="#e8e8e8" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#e8e8e8" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>
`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const CldImage = (props: CldImageProps) => {
  const options: Record<string, string | PlaceholderValue> = {};

  if ( typeof props.width === 'number' && typeof props.height === 'number') {
    options.placeholder = `data:image/svg+xml;base64,${toBase64(shimmer(props.width, props.height))}`;
  }

  return (
    <CldImageDefault
      {...options}
      {...props}
      style={{
        width: '100%',
        height: 'auto'
      }}
    />
  );
}

export default CldImage;