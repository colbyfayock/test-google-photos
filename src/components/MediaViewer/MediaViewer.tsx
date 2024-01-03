"use client";

import { useState } from 'react';

import Container from '@/components/Container';
import CldImage from '@/components/CldImage';
import Button from '@/components/Button';

import { CloudinaryResource } from '@/types/cloudinary';

const transformations: Array<Record<string, string>> = [
  {
    label: 'Restore',
    prop: 'restore'
  },
  {
    label: 'Remove Background',
    prop: 'removeBackground'
  },
  {
    label: 'Black & White',
    prop: 'grayscale'
  },
  {
    label: 'Square',
  },
]

const MediaViewer = ({ resource }: { resource: CloudinaryResource }) => {
  const activeTransformations: Record<string, any> = {};

  const [rotate, setRotate] = useState<number>(0);

  const [restore, setRestore] = useState<boolean>(false);
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);

  const hasAiEnabled = !!restore || !!removeBackground;

  const [square, setSquare] = useState<boolean>(false);
  const [landscape, setLandscape] = useState<boolean>(false);
  const [portrait, setPortrait] = useState<boolean>(false);

  const hasCrop = !!square || !!landscape || !!portrait;

  if ( square ) {
    activeTransformations.height = resource.width;
    activeTransformations.crop = 'fill';
  } else if ( landscape ) {
    activeTransformations.height = Math.floor(resource.width / ( 16 / 9 ));
    activeTransformations.crop = 'fill';
  } else if ( portrait ) {
    activeTransformations.width = Math.floor(resource.height / ( 16 / 9 ));
    activeTransformations.crop = 'fill';
  }
console.log('rotate', rotate)
  return (
    <Container className="grid grid-cols-2 gap-4">
      <CldImage
        width={resource.width}
        height={resource.height}
        src={resource.public_id}
        alt={resource.context?.alt || ''}
        restore={restore}
        removeBackground={removeBackground}
        effects={[
          {
            angle: rotate
          }
        ]}
        {...activeTransformations}
      />
      <div>


        {/* <ul className="grid gap-2">
          <li>
            <Button color={!!rotate ? 'primary' : 'slate'} onClick={() => {
              if ( rotate === 315 ) {
                setRotate(0);
              } else {
                setRotate(rotate + 45);
              }
            }}>Rotate</Button>
          </li>
        </ul> */}

        <h2 className="text-xl font-bold">AI</h2>
        <ul className="grid gap-2">
          <li>
            <Button color={!!restore ? 'primary' : 'slate'} onClick={() => setRestore(!restore)} disabled={!restore && hasAiEnabled}>Restore</Button>
          </li>
          <li>
            <Button color={!!removeBackground ? 'primary' : 'slate'} onClick={() => setRemoveBackground(!removeBackground)} disabled={!removeBackground && hasAiEnabled}>Remove Background</Button>
          </li>
        </ul>

        <h2 className="text-xl font-bold">Crop</h2>
        <ul className="grid gap-2">
          <li>
            <Button color={!!square ? 'primary' : 'slate'} onClick={() => setSquare(!square)} disabled={!square && hasCrop}>Square</Button>
          </li>
          <li>
            <Button color={!!landscape ? 'primary' : 'slate'} onClick={() => setLandscape(!landscape)} disabled={!landscape && hasCrop}>Landscape</Button>
          </li>
          <li>
            <Button color={!!portrait ? 'primary' : 'slate'} onClick={() => setPortrait(!portrait)} disabled={!portrait && hasCrop}>Portrait</Button>
          </li>
        </ul>
      </div>
    </Container>
  )
};

export default MediaViewer;