"use client"

import { columns } from '@/app/_components/columns'
import { DataTable } from '@/components/ui/DataTable'
import { ModeToggle } from '@/components/ui/ModeToggle'
import useFetch from '@/hooks/useFetch'
import db from '@/prisma/client'
import { SignedIn, useAuth, UserButton, useUser } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Task } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PageHome = () => {
  const { data, error, loading } = useFetch("/api/task", 10000);
  const { user } = useUser()

  return (
    <main className=' mt-10 m-auto p-5 border flex flex-col items-center justify-center gap-5 w-[95vw] rounded-md overflow-hidden'>
      <div className='flex items-center justify-between w-full'>
        <div>
          <h1 className='font-semibold text-xl'>
            Welcome back! {user?.fullName}
          </h1>
          <p className='text-muted-foreground'>
            Here's a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>
      </div>
      <div className=" py-10 w-full">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>
    </main>
  )
}

export default PageHome