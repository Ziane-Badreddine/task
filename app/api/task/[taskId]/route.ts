import db from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, props: { params: Promise<{ taskId: string }> }) {

    const {taskId} = await props.params

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json("error", { status: 404 })
    }

    const task = await db.task.findUnique({
        where: {
            id: taskId
        }
    })

    if(!task){
        return NextResponse.json("task not found",{status: 404})
    }

    const body = await request.json();

    const taskUpdated = await db.task.update({
        where: {
            id: taskId
        },
        data: {
            ...body,
            userId
        }
    })

    return NextResponse.json(taskUpdated,{status: 201})

}

export async function DELETE(request: NextRequest, props: { params: Promise<{ taskId: string }> }) {

    const { taskId } = await props.params

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json("error", { status: 404 })
    }

    const task = await db.task.findUnique({
        where: {
            id: taskId
        }
    })

    if(!task){
        return NextResponse.json("task not found",{status: 404})
    }

    

    const taskDeleted = await db.task.delete({
        where: {
            id: taskId
        }
    })

    return NextResponse.json("task is deleted",{status: 201})

}

export async function GET(request: NextRequest, props: { params: Promise<{ taskId: string }> }) {

    const { taskId } = await props.params

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json("error", { status: 404 })
    }

    

    const task = await db.task.findUnique({
        where: {
            id: taskId
        }
    })

    if(!task){
        return NextResponse.json("task not found",{status: 404})
    }

    return NextResponse.json(task,{status: 201})

}