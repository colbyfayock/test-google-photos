"use client";

import { useEffect, useRef, useState } from 'react';

import Container from '@/components/Container';
import CldImage from '@/components/CldImage';
import Upload from '@/components/Upload';
import Button from '@/components/Button';

import { getCollage } from '@/lib/cloudinary';

import { CloudinaryResource } from '@/types/cloudinary';

const MediaLibrary = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [resources, setResources] = useState<Array<CloudinaryResource>>();
  const [selected, setSelected] = useState<Array<string>>();
  const [creation, setCreation] = useState<string>();

  useEffect(() => {
    (async function run() {
      const { data } = await fetch('/api/resources').then(r => r.json());
      setResources(data);
    })();
  }, [])

  useEffect(() => {
    modalRef.current?.showModal();
  }, [creation]);

  async function handleOnUploadSuccess(uploads: Array<CloudinaryResource>) {
    setResources(prev => {
      return [...uploads, ...(prev || [])]
    })
  }

  async function handleOnFormChange(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget as typeof event.currentTarget;
    const fields = Array.from(form?.elements) as Array<HTMLInputElement>;
    const selectedFields = fields
      .filter(field => field.type === 'checkbox' && field.checked)
      .map(field => field.name);

    setSelected(selectedFields);
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

    formRef.current?.reset();
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

      <Upload className="mb-12" onSuccess={handleOnUploadSuccess} />

      <div className="flex justify-between">
        <p className="mb-12">
          {selected && (
            <span>{ selected.length } Selected</span>
          )}
        </p>
        <p>
          <Button onClick={handleOnCreateCollage}>Create Collage</Button>
        </p>
      </div>

      <form ref={formRef} onChange={handleOnFormChange}>
        {Array.isArray(resources) && (
          <ul className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {resources.map((resource) => {
              return (
                <li key={resource.public_id} className="rounded overflow-hidden bg-white dark:bg-slate-700">
                  <div className="relative">
                    <input id={resource.public_id} type="checkbox" name={resource.public_id} />
                    <label htmlFor={resource.public_id}>
                      <CldImage
                        width={800}
                        height={600}
                        src={resource.public_id}
                        alt={resource.context?.alt || ''}
                      />
                    </label>
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