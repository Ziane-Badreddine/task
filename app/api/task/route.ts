import db from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json("error",{status: 404})
    }

    const body = await request.json();

    const newTask = await db.task.create({
        data: {
            ...body,
            userId
        }
    })

    return NextResponse.json(newTask, { status: 201 })

}

export async function GET(request: NextRequest){
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json("error",{status: 404})
    }

    const tasks = await db.task.findMany(({
        where: {
            userId: userId
        },
        orderBy:{
            priority: "asc"
        }
    }))

    return NextResponse.json(tasks,{status: 201})

}