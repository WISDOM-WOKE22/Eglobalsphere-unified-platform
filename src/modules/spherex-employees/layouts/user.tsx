"use client"

import { BackButton } from "@/core/commons/navigation/backButton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserProfile, ActivitiesTab } from "../components/tabs"
import { useSpherexEmployeeService } from "../services"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Profile Skeleton Loader Component
const ProfileSkeleton = () => (
    <main className='flex flex-col gap-5'>
        {/* Main Profile Card Skeleton */}
        <Card className='mt-5 px-5'>
            <div className="py-6">
                {/* Avatar Skeleton */}
                <div className='flex flex-row max-lg:justify-center mb-6'>
                    <Skeleton className='size-24 md:size-30 rounded-full' />
                </div>

                {/* Info Grid Skeleton */}
                <div className='mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2 w-full'>
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className='flex flex-row items-center justify-between gap-2 w-full'>
                            <Skeleton className='h-5 w-28' />
                            <Skeleton className='h-5 w-36' />
                        </div>
                    ))}
                </div>
            </div>
        </Card>

        {/* Checkin/Checkout Activities Skeleton */}
        <Card className='gap-0'>
            <CardHeader>
                <Skeleton className='h-6 w-64 mb-2' />
                <Skeleton className='h-4 w-48' />
            </CardHeader>

            <CardContent className='grid grid-cols-1 gap-2 mt-0 lg:grid-cols-2'>
                {[...Array(2)].map((_, index) => (
                    <div key={index} className='mt-4 grid grid-cols-2 gap-5 max-md:grid-cols-1 border border-dashed rounded-sm p-3'>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className='flex flex-row items-center justify-between gap-2 w-full'>
                                <Skeleton className='h-4 w-16' />
                                <Skeleton className='h-4 w-24' />
                            </div>
                        ))}
                    </div>
                ))}
            </CardContent>
        </Card>
    </main>
)

export const EmployeeLayout = () => {
    const { id } = useParams<{ id: string }>()
    const { getAnEmployee, loading } = useSpherexEmployeeService()
    useEffect(() => {
        getAnEmployee(id)
    }, [id])


    return (
        <main>
            <div className='flex flex-row justify-between mb-3'>
                <BackButton title="Employee profile" />
                <Button variant="destructive" disabled={loading}>
                    {loading ? 'Loading...' : 'Block Account'}
                </Button>
            </div>
            <Tabs defaultValue="profile">
                <TabsList className="w-65">
                    <TabsTrigger value="profile" disabled={loading}>Profile</TabsTrigger>
                    <TabsTrigger value="activities" disabled={loading}>Activities</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    {loading ? (
                        <ProfileSkeleton />
                    ) : (
                        <UserProfile />
                    )}
                </TabsContent>
                <TabsContent value="activities">
                    {loading ? (
                        <div className="mt-5">
                            <Card>
                                <CardContent className="py-10">
                                    <div className="flex flex-col gap-4">
                                        {[...Array(5)].map((_, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <Skeleton className="h-12 w-12 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-3/4" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <ActivitiesTab />
                    )}
                </TabsContent>
            </Tabs>
        </main>
    )
}