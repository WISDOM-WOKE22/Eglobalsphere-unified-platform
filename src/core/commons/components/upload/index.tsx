'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  error,
  disabled,
  placeholder,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (
      value &&
      typeof value === 'object' &&
      'name' in value &&
      'type' in value
    ) {
      // Check if it's a File object without using instanceof
      const url = URL.createObjectURL(value as File);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url); // Cleanup
    } else if (typeof value === 'string') {
      setPreviewUrl(value); // Use the string URL directly
    } else {
      setPreviewUrl(null);
    }
  }, [value, isClient]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange?.(file);
  };

  // Don't render until client-side to avoid SSR issues
  if (!isClient) {
    return (
      <div className='flex flex-col items-start'>
        <div className='flex flex-row-reverse gap-2 items-center'>
          <div className='relative h-24 w-24 border rounded-sm text-center flex justify-center items-center text-muted-foreground p-2'>
            <p>{placeholder ?? 'Upload Image'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start'>
      <div className='flex flex-row-reverse gap-2 items-center'>
        {!previewUrl && (
          <div
            className='relative h-24 w-24 border rounded-sm text-center flex justify-center items-center text-muted-foreground cursor-pointer p-2'
            onClick={() => fileInputRef.current?.click()}
          >
            <p>{placeholder ?? 'Upload Image'}</p>
          </div>
        )}
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/jpeg,image/png'
          className='hidden'
          disabled={disabled}
        />
        {previewUrl && (
          <div
            className='relative h-24 w-24 border rounded-sm cursor-pointer'
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={previewUrl}
              alt='Selected image preview'
              width={96}
              height={96}
              className='object-contain rounded-md h-24 w-24'
              priority
            />
          </div>
        )}
      </div>
      {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
    </div>
  );
}
