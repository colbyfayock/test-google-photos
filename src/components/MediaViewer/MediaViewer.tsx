"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { FaWandMagicSparkles, FaScissors, FaDroplet } from "react-icons/fa6";
import { LuRectangleHorizontal, LuRectangleVertical, LuSquare } from "react-icons/lu";
import { BiSolidGrid } from "react-icons/bi";
import { IoColorPalette } from "react-icons/io5";
import { getCldImageUrl } from 'next-cloudinary';

import Container from '@/components/Container';
import CldImage from '@/components/CldImage';
import Button from '@/components/Button';

import { CloudinaryResource } from '@/types/cloudinary';

const MediaViewer = ({ resource }: { resource: CloudinaryResource }) => {
  const router = useRouter()

  const [activeTransformations, setActiveTransformations] = useState<Record<string, any>>({});

  const transformations: Record<string, any> = {};

  Object.entries(activeTransformations).forEach(([_, group]) => {
    Object.entries(group).forEach(([key, value]) => {
      if ( ['restore', 'removeBackground', 'grayscale', 'sepia', 'vignette'].includes(key) ) {
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
      } else if ( key === 'blur' && value === true ) {
        transformations.blur = 800;
      } else if ( key === 'pixelate' && value === true ) {
        transformations.pixelate = 30;
      }
    })
  });

  async function handleOnSave() {
    const url = getCldImageUrl({
      src: resource.public_id,
      width: resource.width,
      height: resource.height,
      ...transformations
    })

    const formData = new FormData();
    
    formData.append('publicId', resource.public_id);
    formData.append('file', url);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json())

    router.refresh();
    handleOnReset();
  }

  async function handleOnSaveCopy() {
    const url = getCldImageUrl({
      src: resource.public_id,
      width: resource.width,
      height: resource.height,
      ...transformations
    })

    const formData = new FormData();

    formData.append('file', url);
    formData.append('tags', `original-${resource.public_id}`);

    const results = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json())

    router.push(`/images/${results.public_id}`);
  }

  function handleOnReset() {
    setActiveTransformations({});
  }

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const group = event.target.name;
    const option = event.target.value;

    setActiveTransformations(prev => {
      if ( !option ) {
        return {
          ...prev,
          [group]: {}
        }
      }
      return {
        ...prev,
        [group]: {
          [option]: true
        }
      }
    })
  }

  return (
    <>
      <Container className="flex justify-end items-center mb-12">
        <ul className="flex items-center gap-4">
          {Object.keys(transformations).length > 0 && (
            <>
              <li>
                <Button onClick={handleOnSave}>Save</Button>
              </li>
              <li>
                <Button onClick={handleOnSaveCopy}>Save as Copy</Button>
              </li>
              <li>
                <Button color="red" onClick={handleOnReset}>Discard Changes</Button>
              </li>
            </>
          )}
          {Object.keys(transformations).length === 0 && (
            <li>
              <Button color="red">Delete Image</Button>
            </li>
          )}
        </ul>
      </Container>
      <Container className="grid grid-cols-2 gap-4">
        <CldImage
          key={JSON.stringify(transformations)}
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

            <ul className="flex gap-2 mb-6">
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

            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <ul className="flex gap-2 mb-6">
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!activeTransformations.filters || Object.entries(activeTransformations.filters).length === 0 ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="filters" value="" checked={!activeTransformations.filters || Object.entries(activeTransformations.filters).length === 0} onChange={handleOnChange} />
                  <span className="font-semibold text-white">None</span> 
                </label>
              </li>
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.filters?.grayscale ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="filters" value="grayscale" checked={!!activeTransformations.filters?.grayscale} onChange={handleOnChange} />
                  <IoColorPalette />
                  <span className="font-semibold text-white">Grayscale</span> 
                </label>
              </li>
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.filters?.sepia ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="filters" value="sepia" checked={!!activeTransformations.filters?.sepia} onChange={handleOnChange} />
                  <IoColorPalette />
                  <span className="font-semibold text-white">Sepia</span> 
                </label>
              </li>
            </ul>

            <h2 className="text-xl font-bold mb-4">Effects</h2>

            <ul className="flex gap-2 mb-6">
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!activeTransformations.effects || Object.entries(activeTransformations.effects).length === 0 ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="effects" value="" checked={!activeTransformations.effects || Object.entries(activeTransformations.effects).length === 0} onChange={handleOnChange} />
                  <span className="font-semibold text-white">None</span> 
                </label>
              </li>
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.effects?.blur ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="effects" value="blur" checked={!!activeTransformations.effects?.blur} onChange={handleOnChange} />
                  <FaDroplet />
                  <span className="font-semibold text-white">Blur</span> 
                </label>
              </li>
              <li className="mb-1">
                <label className={`btn w-auto inline-flex items-center gap-2 cursor-pointer ${!!activeTransformations.effects?.pixelate ? 'btn-primary' : 'btn-neutral'}`}>
                  <input className="sr-only" type="radio" name="effects" value="pixelate" checked={!!activeTransformations.effects?.pixelate} onChange={handleOnChange} />
                  <BiSolidGrid />
                  <span className="font-semibold text-white">Pixelate</span> 
                </label>
              </li>
            </ul>
          </form>
        </div>
      </Container>
    </>
  )
};

export default MediaViewer;