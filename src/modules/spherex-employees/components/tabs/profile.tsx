import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getStatusBadge } from '@/core/commons/components/badge/badge';
import moment from 'moment';
import { SpherexEmployee } from '@/types';

export const UserProfile = ({ user }: { user: SpherexEmployee }) => {
    return (
        <main className='flex flex-col gap-5'>
            <Card className='mt-5 px-5'>
                <div>
                    <div className='flex flex-row max-lg:justify-center'>
                        <Avatar className='size-24 md:size-30'>
                            <AvatarFallback className='text-2xl md:text-6xl font-bold'>
                                {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className='mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2 w-full'>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>First Name :</p>
                            <p>{user?.first_name}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Last Name :</p>
                            <p>{user?.last_name}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Email :</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Date joined :</p>
                            <p>{moment(user?.created_at_source).format('MMMM D, YYYY')}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Department:</p>
                            <p>{user?.department}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Zone :</p>
                            <p>{user?.zones}</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Verification :</p>
                            {getStatusBadge(user?.enabled ? 'verified' : 'not verified')}
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Status :</p>
                            {!user?.enabled ? (
                                <p className='text-red-500'>Blocked</p>
                            ) : (
                                <p className='text-green-500'>Active</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <Card className='gap-0'>
                <CardHeader>
                    <h1 className='font-bold'>Checkin/Checkout Activities</h1>
                    <p className='text-gray-200'>Last Checkin : Sun Apr 27 2026</p>
                </CardHeader>

                <CardContent className='grid grid-cols-1 gap-2 mt-0 lg:grid-cols-2'>
                    <div className='mt-4 grid grid-cols-2 gap-5 max-md:grid-cols-1 border border-dash rounded-sm p-3'>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Time :</p>
                            <p>12:00</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Zone :</p>
                            <p>Zone 22</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Gate :</p>
                            <p>Gate 22</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Location :</p>
                            <p>TTTTTT</p>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-2 gap-5 max-md:grid-cols-1 border border-dash rounded-sm p-3'>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Time :</p>
                            <p>12:00</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Zone :</p>
                            <p>Zone 22</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Gate :</p>
                            <p>Gate 22</p>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 w-full'>
                            <p className='font-bold'>Location :</p>
                            <p>TTTTTT</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};
