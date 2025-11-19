'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type Calendar24Props = {
  label?: string;
  value?: string; // ISO string
  onchange?: (value: string | undefined) => void; // Return ISO string
};

export default function Calendar24({
  label,
  value,
  onchange,
}: Calendar24Props) {
  const initialDate = value ? new Date(value) : undefined;
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState(() => {
    if (initialDate) {
      const hrs = initialDate.getHours().toString().padStart(2, '0');
      const mins = initialDate.getMinutes().toString().padStart(2, '0');
      const secs = initialDate.getSeconds().toString().padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    }
    return '09:30:00';
  });

  // Combine date + time into ISO string
  const getTimestamp = (): string | undefined => {
    if (!date) return undefined;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours);
    combined.setMinutes(minutes);
    combined.setSeconds(seconds);
    combined.setMilliseconds(0);
    return combined.toISOString();
  };

  const timestamp = getTimestamp();

  // Emit ISO string to parent
  React.useEffect(() => {
    if (onchange) {
      onchange(timestamp);
    }
  }, [timestamp]);

  // Sync with external value
  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      setDate(d);
      const hrs = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      const secs = d.getSeconds().toString().padStart(2, '0');
      setTime(`${hrs}:${mins}:${secs}`);
    }
  }, [value]);

  return (
    <div>
      <Label htmlFor='date'>{label}</Label>
      <div className='flex gap-4 w-full mt-1'>
        <div className='flex flex-col gap-3 w-full'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                id='date'
                className='min-w-full justify-between font-normal h-[38px]'
              >
                {date ? date.toLocaleDateString() : 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={date}
                captionLayout='dropdown'
                onSelect={(selected) => {
                  if (selected) {
                    setDate(selected);
                    setOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-3'>
          <Input
            type='time'
            id='time'
            step='1'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='bg-background h-[38px] appearance-none [&::-webkit-calendar-picker-indicator]:hidden'
          />
        </div>
      </div>
    </div>
  );
}
