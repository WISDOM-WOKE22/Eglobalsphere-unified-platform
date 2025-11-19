'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FileText, X, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FileUploadProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  error?: string | null;
  height?: number;
  disabled?: boolean;
}

function isImageFile(file: File | string | null): boolean {
  if (!file) return false;
  if (typeof file === 'string') {
    // crude check for image url
    return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(file);
  }
  return file.type.startsWith('image/');
}

function isTextFile(file: File | string | null): boolean {
  if (!file) return false;
  if (typeof file === 'string') {
    return /\.(txt|csv)$/i.test(file);
  }
  return file.type.startsWith('text/') || !!file.name.match(/\.(txt|csv)$/i);
}

function isPdfFile(file: File | string | null): boolean {
  if (!file) return false;
  if (typeof file === 'string') {
    return /\.pdf$/i.test(file);
  }
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

function isOfficeFile(file: File | string | null): boolean {
  if (!file) return false;
  if (typeof file === 'string') {
    return /\.(docx?|xlsx?|pptx?)$/i.test(file);
  }
  return (
    file.type === 'application/msword' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-powerpoint' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    !!file.name.match(/\.(docx?|xlsx?|pptx?)$/i)
  );
}

function getFileName(file: File | string | null): string {
  if (!file) return '';
  if (typeof file === 'string') {
    try {
      const url = new URL(file, window.location.origin);
      return url.pathname.split('/').pop() || file;
    } catch {
      return file;
    }
  }
  return file.name;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper to read text file preview (first N lines)
async function getTextFilePreview(file: File, maxLines = 10): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = (e.target?.result as string) || '';
      const lines = text.split('\n').slice(0, maxLines).join('\n');
      resolve(lines);
    };
    reader.readAsText(file);
  });
}

export default function FileUpload({
  value,
  onChange,
  error,
  disabled,
  height,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingTextPreview, setPendingTextPreview] = useState<string | null>(
    null
  );
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // To keep track of object URLs for cleanup
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let revoke: string | undefined;
    if (
      value &&
      typeof value === 'object' &&
      'name' in value &&
      'type' in value
    ) {
      // Check if it's a File object without using instanceof
      const file = value as File;
      setFileName(file.name);
      if (isImageFile(file)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setTextPreview(null);
        revoke = url;
        previewUrlRef.current = url;
      } else if (isTextFile(file)) {
        setPreviewUrl(null);
        getTextFilePreview(file).then(setTextPreview);
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      } else if (isPdfFile(file)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setTextPreview(null);
        revoke = url;
        previewUrlRef.current = url;
      } else {
        setPreviewUrl(null);
        setTextPreview(null);
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      }
    } else if (typeof value === 'string') {
      setFileName(getFileName(value));
      setPreviewUrl(null);
      setTextPreview(null);
      if (isImageFile(value)) {
        setPreviewUrl(value);
      } else if (isPdfFile(value)) {
        setPreviewUrl(value);
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    } else {
      setFileName('');
      setPreviewUrl(null);
      setTextPreview(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    }
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [value]);

  useEffect(() => {
    // When pendingFile changes, if it's a text file, load preview
    if (pendingFile && isTextFile(pendingFile)) {
      getTextFilePreview(pendingFile).then(setPendingTextPreview);
    } else {
      setPendingTextPreview(null);
    }
  }, [pendingFile]);

  // Clean up object URLs created for pendingFile preview
  const pendingPreviewUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (pendingFile && (isImageFile(pendingFile) || isPdfFile(pendingFile))) {
      const url = URL.createObjectURL(pendingFile);
      pendingPreviewUrlRef.current = url;
      return () => {
        if (pendingPreviewUrlRef.current) {
          URL.revokeObjectURL(pendingPreviewUrlRef.current);
          pendingPreviewUrlRef.current = null;
        }
      };
    } else {
      if (pendingPreviewUrlRef.current) {
        URL.revokeObjectURL(pendingPreviewUrlRef.current);
        pendingPreviewUrlRef.current = null;
      }
    }
    // eslint-disable-next-line
  }, [pendingFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPendingFile(file);
      setShowReviewModal(true);
    }
  };

  const handleConfirmUpload = () => {
    onChange?.(pendingFile);
    setPendingFile(null);
    setShowReviewModal(false);
    setPendingTextPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelUpload = () => {
    setPendingFile(null);
    setShowReviewModal(false);
    setPendingTextPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange?.(null);
    setPreviewUrl(null);
    setFileName('');
    setTextPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  // The preview container click handler
  const handlePreviewClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // File preview for non-image files
  function renderFilePreview(
    file: File | string | null,
    url: string | null,
    textPreview: string | null
  ) {
    if (!file) return null;
    if (isImageFile(file) && url) {
      return (
        <div
          className={cn(
            'relative w-full border rounded-sm overflow-hidden mb-2 flex items-center justify-center bg-muted/30',
            height ? `h-[${height}px]` : 'h-100'
          )}
        >
          {/* next/image requires src to be absolute or relative path, not object URL in SSR, but this is client-side */}
          <Image
            src={url}
            alt='Selected image preview'
            className='object-contain rounded-md'
            fill
            priority
            unoptimized={url.startsWith('blob:')}
          />
        </div>
      );
    }
    if (isPdfFile(file) && url) {
      // Show PDF preview using <embed>
      return (
        <div
          className={cn(
            'w-full border rounded-sm overflow-hidden mb-2 flex items-center justify-center bg-muted/30',
            height ? `h-[${height}px]` : 'h-100'
          )}
        >
          <embed
            src={url}
            type='application/pdf'
            width='100%'
            height='100%'
            className='rounded'
          />
        </div>
      );
    }
    if (isTextFile(file) && textPreview) {
      return (
        <div
          className={cn(
            'w-full border rounded-sm overflow-hidden mb-2 flex flex-col bg-muted/30',
            height ? `h-[${height}px]` : 'h-100'
          )}
        >
          <div className='px-2 py-1 text-xs font-mono text-muted-foreground border-b bg-muted'>
            Text Preview
          </div>
          <pre className='flex-1 px-2 py-2 text-xs font-mono whitespace-pre-wrap overflow-auto'>
            {textPreview}
          </pre>
        </div>
      );
    }
    // For other files, just show icon and name
    return (
      <div className='flex items-center gap-2 border rounded-sm px-3 py-2 bg-muted mb-2'>
        <FileText className='w-5 h-5 text-muted-foreground' />
        <span className='truncate'>{getFileName(file)}</span>
      </div>
    );
  }

  // Compute height style for dropzone
  const dropzoneHeight = height ? { height: `${height}px` } : {};

  return (
    <div className={cn('flex flex-col items-start w-full')}>
      <div className='flex flex-row items-center gap-2 mb-2'>
        <Label className='mb-2'>File</Label>
        {value && (
          <button
            type='button'
            onClick={handleRemove}
            className='ml-2 p-1 rounded hover:bg-muted transition-colors'
            aria-label='Remove file'
            disabled={disabled}
            tabIndex={0}
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      <div className={cn('flex flex-row-reverse gap-2 items-center w-full')}>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          //   accept='image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx'
          accept='image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/pdf'
          className='hidden'
          disabled={disabled}
        />
        <div
          className={cn(
            'w-full cursor-pointer',
            disabled ? 'opacity-60 pointer-events-none' : ''
          )}
          onClick={handlePreviewClick}
          tabIndex={0}
          role='button'
          aria-disabled={disabled}
          style={dropzoneHeight}
        >
          {value ? (
            renderFilePreview(value, previewUrl, textPreview)
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center border border-dashed rounded-sm px-3 py-8 bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors',
                !height && 'h-100'
              )}
              style={dropzoneHeight}
            >
              <FileText className='w-8 h-8 mb-2' />
              <span className='font-medium'>Click to select a file</span>
              <span className='text-xs mt-1 text-muted-foreground'>
                Supported: images, pdf, doc, xls, ppt, txt, csv
              </span>
            </div>
          )}
        </div>
      </div>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

      {/* Review Modal */}
      <AlertDialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <AlertDialogContent className='sm:max-w-[500px]'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='w-5 h-5 text-yellow-500' />
              Review File Upload
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please review the file details before confirming the upload.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingFile && (
            <div className='space-y-4'>
              <div className='border rounded-lg p-4 bg-muted/50'>
                <div className='flex items-center gap-3 mb-3'>
                  <FileText className='w-6 h-6 text-muted-foreground' />
                  <div className='flex-1'>
                    <h4 className='font-medium text-sm'>{pendingFile.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(pendingFile.size)} • {pendingFile.type}
                    </p>
                  </div>
                </div>

                {renderFilePreview(
                  pendingFile,
                  pendingFile &&
                    (isImageFile(pendingFile) || isPdfFile(pendingFile))
                    ? pendingPreviewUrlRef.current || ''
                    : null,
                  pendingTextPreview
                )}

                <div className='mt-3 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>File name:</span>
                    <span className='font-medium'>{pendingFile.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>File size:</span>
                    <span className='font-medium'>
                      {formatFileSize(pendingFile.size)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>File type:</span>
                    <span className='font-medium'>
                      {pendingFile.type || 'Unknown'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Last modified:
                    </span>
                    <span className='font-medium'>
                      {new Date(pendingFile.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0' />
                  <div className='text-sm'>
                    <p className='font-medium text-yellow-800 dark:text-yellow-200'>
                      Upload Confirmation Required
                    </p>
                    <p className='text-yellow-700 dark:text-yellow-300 mt-1'>
                      Please confirm that this is the correct file you want to
                      upload. This action will replace any existing file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelUpload}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpload}>
              Confirm Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
