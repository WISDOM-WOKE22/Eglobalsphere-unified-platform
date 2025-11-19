import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStatusBadge } from '@/core/commons/components/badge/badge';
import { useCategoryService } from '@/modules/categories/services/categoryServices';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function UserCategoryTable() {
  const router = useRouter();
  const { data } = useCategoryService();

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pl-2 py-0'>
        <h1 className='text-2xl font-semibold'>User Categories</h1>
        <Link href={'/categories'}>
          <SquareArrowOutUpRight size={18} className='cursor-pointer' />
        </Link>
      </CardHeader>
      <Separator />
      <CardContent className='px-2 pt-0'>
        <Table className='px-2'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>No Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align='right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.slice(0, 4).map((category) => (
              <TableRow key={category.id}>
                <TableCell className='font-medium'>{category.name}</TableCell>
                <TableCell>100</TableCell>
                <TableCell>
                  {getStatusBadge(category.status ? 'active' : 'inactive')}
                </TableCell>
                <TableCell>
                  <button
                    className='text-blue-500 hover:text-blue-700 cursor-pointer'
                    onClick={() => router.push(`/categories/${category.id}`)}
                  >
                    view
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {data && data?.length <= 0 && (
        <div className='flex items-center justify-center w-full flex-col'>
          <p>You don&apos;t have any user category</p>
          <Button
            className='mt-10'
            onClick={() => router.push('/categories/create')}
          >
            Create a User Category
          </Button>
        </div>
      )}
    </Card>
  );
}
