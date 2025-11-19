'use client';

import NoteNavigation from '../navigation/noteNavigation';
import { notes } from '@/core/constants/note';

export default function NoteLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <main className='w-full lg:overflow-x-hidden'>
      <NoteNavigation note={notes[0]}>{children}</NoteNavigation>
      {/* <div className="pl-[25px] max-[500px]:px-[10px] md:pl-[260px] pt-[75px] pr-[25px] pb-[25px]">
                </div> */}
    </main>
  );
}
