'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export const BackButton = ({ title }: { title: string }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className='flex gap-1 items-center cursor-pointer'
      onClick={handleBack}
    >
      <ChevronLeft />
      <h1 className='font-semibold'>{title || 'Back'}</h1>
    </div>
  );
};
