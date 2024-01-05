"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CldUploadWidgetResults } from 'next-cloudinary';

import Container from '@/components/Container';
import CldUploadWidget from '@/components/CldUploadWidget';
import CldImage from '@/components/CldImage';
import Button from '@/components/Button';

import { getCollage } from '@/lib/cloudinary';

import { CloudinaryResource } from '@/types/cloudinary';

const MediaLibrary = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [resources, setResources] = useState<Array<CloudinaryResource>>();
  const [selected, setSelected] = useState<Array<string>>([]);
  const [creation, setCreation] = useState<string>();

  useEffect(() => {
    (async function run() {
      const { data } = await fetch('/api/resources', { cache: 'no-store' }).then(r => r.json());
      setResources(data);
    })();
  }, [])

  useEffect(() => {
    modalRef.current?.showModal();
  }, [creation]);

  function handleOnClearSelection() {
    setSelected([]);
  }

  async function handleOnUploadSuccess(results: CldUploadWidgetResults) {
    setResources(prev => [results.info as CloudinaryResource, ...(prev || [])]);
  }

  async function handleOnSelectImage(event: React.ChangeEvent<HTMLInputElement>) {
    setSelected((prev) => {
      if ( event.target.checked ) {
        return Array.from(new Set([...(prev || []), event.target.name]));
      } else {
        return prev.filter((id) => id !== event.target.name);
      }
    });
  }

  async function handleOnCreateCollage() {
    if ( !Array.isArray(selected) || selected.length <= 0 ) return;

    const url = getCollage(selected);

    setCreation(url);
  }

  async function handleOnSaveCreation() {
    if ( typeof creation !== 'string' ) return;

    const formData = new FormData();

    formData.append('file', creation);
    formData.append('tags', 'creation');

    const resource = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json())

    setCreation(undefined);

    setResources(prev => {
      return [resource, ...(prev || [])]
    });

    handleOnClearSelection();
  }

  return (
    <Container>
      {creation && (
        <dialog ref={modalRef} id="my_modal_1" className="modal max-h-full">
          <div className="h-full max-h-full modal-box">
            <h3 className="font-bold text-lg">Wait for it to load</h3>
            <CldImage
              src={creation}
              width={1200}
              height={1200}
              alt="creation"
              preserveTransformations
            />
            <div className="modal-action">
              <form method="dialog">
                <Button onClick={handleOnSaveCreation}>
                  Save
                </Button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          {selected.length === 0 && (
            <CldUploadWidget
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={handleOnUploadSuccess}
              options={{
                tags: [String(process.env.NEXT_PUBLIC_CLOUDINARY_ASSETS_TAG)]
              }}
            >
              {({ open }) => (
                <Button onClick={() => open()}>Upload</Button>
              )}
            </CldUploadWidget>
          )}
          {selected.length > 0 && (
            <>
              <ul>
                <li>
                  <Button color="red" onClick={handleOnClearSelection}>Clear Selected</Button>
                </li>
              </ul>
              <p>
                <span>{ selected?.length } Selected</span>
              </p>
            </>
          )}
        </div>

        {selected && selected.length > 0 && (
          <ul className="flex items-center gap-4">
            <li>
              <Button onClick={handleOnCreateCollage}>Create Collage</Button>
            </li>
          </ul>
        )}
      </div>

      <form ref={formRef}>
        {Array.isArray(resources) && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {resources.map((resource) => {
              const isChecked = selected.includes(resource.public_id);
              return (
                <li key={resource.public_id} className="overflow-hidden bg-white dark:bg-slate-700">
                  <div className="relative">
                    <label className="absolute top-3 left-3 p-1" htmlFor={resource.public_id}>
                      <span className="sr-only">Select Image { resource.public_id }</span>
                      <input id={resource.public_id} className="checkbox" type="checkbox" name={resource.public_id} checked={isChecked} onChange={handleOnSelectImage} />
                    </label>
                    <Link className={`bg-blue-100 block cursor-pointer border-8 transition-[border] ${isChecked ? 'border-primary' : 'border-white'}`} href={`/images/${resource.public_id}`}>
                      <CldImage
                        className="block"
                        width={resource.width}
                        height={resource.height}
                        src={resource.public_id}
                        alt={resource.context?.alt || ''}
                      />
                    </Link>
                  </div>
                  { resource.context?.caption && (
                    <div className="py-4 px-5">
                      <p className="mb-1 text-md font-bold leading-tight text-neutral-800 dark:text-neutral-50">
                        { resource.context?.caption || '' }
                      </p>
                    </div>
                  )}
                  
                </li>
              )
            })}
          </ul>
        )}
      </form>
    </Container>
  )
};

export default MediaLibrary;