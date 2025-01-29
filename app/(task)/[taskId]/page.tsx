import Edit from '@/app/_components/Edit';
import db from '@/prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import React from 'react'

const PageEdit = async (props: { params: Promise<{ taskId: string }> }) => {

  const user = await currentUser()
  if(!user?.id){
    redirect("/");
  }
  const params = await props.params

  const task = await db.task.findUnique({
    where: {
      id: params.taskId
    },
  });


  return (
    <div>
      <Edit task={task} />
    </div>
  );
};

export default PageEdit