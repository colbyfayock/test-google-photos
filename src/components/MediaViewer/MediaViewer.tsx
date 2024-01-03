"use client";

import { useState } from 'react';
import { FaWandMagicSparkles, FaScissors } from "react-icons/fa6";
import { LuRectangleHorizontal, LuRectangleVertical, LuSquare } from "react-icons/lu";


import Container from '@/components/Container';
import CldImage from '@/components/CldImage';
import Button from '@/components/Button';

import { CloudinaryResource } from '@/types/cloudinary';

const MediaViewer = ({ resource }: { resource: CloudinaryResource }) => {

  const [activeTransformations, setActiveTransformations] = useState<Record<string, any>>({});

  const transformations: Record<string, any> = {};

  Object.entries(activeTransformations).forEach(([_, group]) => {
    Object.entries(group).forEach(([key, value]) => {
      if ( ['restore', 'removeBackground'].includes(key) ) {
        transformations[key] = true;
      } else if ( key === 'square' && value === true ) {
        transformations.height = resource.width;
        transformations.crop = 'fill';
      } else if ( key === 'landscape' && value === true ) {
        transformations.height = Math.floor(resource.width / ( 16 / 9 ));
        transformations.crop = 'fill';
      } else if ( key === 'portrait' && value === true ) {
        transformations.width = Math.floor(resource.height / ( 16 / 9 ));
        transformations.crop = 'fill';
      }
    })
  });

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const group = event.target.name;
    const option = event.target.value;

    setActiveTransformations(prev => {
      return {
        ...prev,
        [group]: {
          [option]: true
        }
      }
    })
  }

  return (
    <Container className="grid grid-cols-2 gap-4">
      <CldImage
        width={resource.width}
        height={resource.height}
        src={resource.public_id}
        alt={resource.context?.alt || ''}
        {...transformations}
      />
      <div>

        <form>
          <h2 className="text-xl font-bold mb-4">AI</h2>
        
          <ul className="flex gap-2 mb-6">
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!activeTransformations.ai || Object.entries(activeTransformations.ai).length === 0 ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="ai" value="" checked={!activeTransformations.ai || Object.entries(activeTransformations.ai).length === 0} onChange={handleOnChange} />
                <span className="font-semibold text-white">None</span> 
              </label>
            </li>
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${activeTransformations.ai?.restore ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="ai" value="restore" checked={!!activeTransformations.ai?.restore} onChange={handleOnChange} />
                <FaWandMagicSparkles />
                <span className="font-semibold text-white">Restore</span> 
              </label>
            </li>
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${activeTransformations.ai?.removeBackground ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="ai" value="removeBackground" checked={!!activeTransformations.ai?.removeBackground} onChange={handleOnChange} />
                <FaScissors />
                <span className="font-semibold text-white">Remove Background</span> 
              </label>
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-4">Crop</h2>

          <ul className="flex gap-2">
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!activeTransformations.crop || Object.entries(activeTransformations.crop).length === 0 ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="crop" value="" checked={!activeTransformations.crop || Object.entries(activeTransformations.crop).length === 0} onChange={handleOnChange} />
                <span className="font-semibold text-white">None</span> 
              </label>
            </li>
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.crop?.square ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="crop" value="square" checked={!!activeTransformations.crop?.square} onChange={handleOnChange} />
                <LuSquare />
                <span className="font-semibold text-white">Square</span> 
              </label>
            </li>
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.crop?.landscape ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="crop" value="landscape" checked={!!activeTransformations.crop?.landscape} onChange={handleOnChange} />
                <LuRectangleHorizontal />
                <span className="font-semibold text-white">Landscape</span> 
              </label>
            </li>
            <li className="mb-1">
              <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.crop?.portrait ? 'btn-primary' : 'btn-neutral'}`}>
                <input className="sr-only" type="radio" name="crop" value="portrait" checked={!!activeTransformations.crop?.portrait} onChange={handleOnChange} />
                <LuRectangleVertical />
                <span className="font-semibold text-white">Portait</span> 
              </label>
            </li>
          </ul>
        </form>
      </div>
    </Container>
  )
};

export default MediaViewer;