"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Backpack, CheckCircle, Circle, CircleHelp, Clock, Home, Loader, MoveDown, MoveRight, MoveUp, Pencil, Slash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import axios from "axios";
import { toast } from "sonner"
import { Task } from "@prisma/client"
import { ModeToggle } from "@/components/ui/ModeToggle"




const formSchema = z.object({
    title: z.string().trim().min(2, {
        message: "title must be at least 2 characters.",
    }).max(40),
    description: z.optional(z.string().trim().min(0).max(150, {
        message: "Description must be at most 150 characters.",
    })),
    type: z.string().trim().min(3).max(10),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELED', 'BACKLOG']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'])
})

const Edit = ({ task }: { task: Task | null }) => {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            type: task?.type || "",
            status: task?.status || "TODO",
            priority: task?.priority || "MEDIUM"
        }
    })

    const [isSubmiting, setIsSubmiting] = useState(false);
    const { userId } = useAuth()
    if (!userId) {
        toast.warning("User is not authenticated");
        return;
    }
    const router = useRouter();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmiting(true);
            toast("task is edited...");
            const response = await axios.patch(`api/task/${task?.id}`, {
                ...values,
                userId
            });
            if (response.status === 201) {
                toast.success("user is edited", {
                    className: "bg-green",
                });
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.warning("something went wrong", {
                className: "bg-rose-500 text-white",
            });
        } finally {
            setIsSubmiting(false);
        }

    }
    return (
        <div className="m-auto mt-10  w-[60vw] min-h-[70vh] flex flex-col gap-5 border border-muted-foreground p-5 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-serif underline underline-offset-4 italic ">
                    Edit Task
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <ModeToggle />
                    <Button size={"icon"}>
                        <Link href={"/home"}>
                            <Home className="w-3 h-3" />
                        </Link>
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Fix bug in login page" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="There is an issue where the login form is not accepting valid credentials..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="TODO"><div className="flex  gap-1">
                                                    <Circle className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                    <p>Todo</p>
                                                </div></SelectItem>
                                                <SelectItem value="IN_PROGRESS"><div className="flex  gap-1">
                                                    <Clock className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                    <p>In proggress</p>
                                                </div></SelectItem>
                                                <SelectItem value="DONE"><div className="flex  gap-1">
                                                    <CheckCircle className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                    <p>Done</p>
                                                </div></SelectItem>
                                                <SelectItem value="CANCELED">
                                                    <div className="flex  gap-1">
                                                        <Slash className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                        <p>Canceled</p>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="BACKLOG">
                                                    <div className="flex  gap-1">
                                                        <CircleHelp className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                        <p>Backlog</p>
                                                    </div>
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Priority</SelectLabel>
                                                <SelectItem value="LOW">
                                                    <div className="flex gap-1">
                                                        <MoveDown className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                        <p>Low</p>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="MEDIUM">
                                                    <div className="flex gap-1">
                                                        <MoveRight className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                        <p>Medium</p>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="HIGH">
                                                    <div className="flex gap-1">
                                                        <MoveUp className="text-muted-foreground w-4 h-4 mt-[1px]" />
                                                        <p>High</p>
                                                    </div>
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <Button className="w-full" type="submit">
                        {!isSubmiting && <Pencil className="h-5 w-5" />}
                        Edit
                        {isSubmiting && <Loader className="h-5 w-5 animate-spin" />}
                    </Button>
                </form>
            </Form>
        </div>

    )
}

export default Edit