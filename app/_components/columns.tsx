"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { $Enums, Task } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, Circle, CircleHelp, Clock, Copy, MoreHorizontal, MoveDown, MoveRight, MoveUp, Pencil, Slash, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          <Badge variant={"outline"}>
            {row.original.type.toUpperCase()}
          </Badge>
          <h1 className="font-medium">
            {row.getValue("title")}
          </h1>
        </div>)
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-2">
          <h1 className="font-medium">
            {row.getValue("description")}
          </h1>
        </div>)
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 ">
          {(row.getValue("status") == $Enums.Status.BACKLOG) && <CircleHelp className="text-muted-foreground w-4 h-4" />}
          {(row.getValue("status") == $Enums.Status.TODO) && <Circle className="text-muted-foreground w-4 h-4" />}
          {(row.getValue("status") == $Enums.Status.IN_PROGRESS) && <Clock className="text-muted-foreground w-4 h-4" />}
          {(row.getValue("status") == $Enums.Status.DONE) && <CheckCircle className="text-muted-foreground w-4 h-4" />}
          {(row.getValue("status") == $Enums.Status.CANCELED) && <Slash className="text-muted-foreground w-4 h-4" />}
          {row.getValue("status")}
        </div>)
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="priority" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {(row.getValue("priority") == $Enums.Priority.MEDIUM) && <MoveRight className="text-muted-foreground w-4 h-4 " />}
          {(row.getValue("priority") == $Enums.Priority.HIGH) && <MoveUp className="text-muted-foreground w-4 h-4 " />}
          {(row.getValue("priority") == $Enums.Priority.LOW) && <MoveDown className="text-muted-foreground w-4 h-4 " />}
          {row.getValue("priority")}
        </div>)
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original
      const router = useRouter();


      const handleDelete = async () => {
        try {
          toast("task is deleted...");
          const response = await axios.delete(`api/task/${task.id}`);
          if (response.status === 201) {
            toast.success("user is deleted", {
              className: "bg-green",
            });
            router.push("/");
            router.refresh();
          }
        } catch (error) {
          toast.warning("something went wrong", {
            className: "bg-rose-500 text-white",
          });
        }

      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              
            >
              <Link href={`${task.id}`} className="w-full flex gap-1">
                <Pencil className="w-4 h-4" />
                Edit
              </Link>


            </DropdownMenuItem>
            <DropdownMenuItem>
              <button className="w-full flex gap-1 " onClick={handleDelete}>
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem><button className="w-full flex gap-1" onClick={() => navigator.clipboard.writeText(task.title)}>
              <Copy className="w-4 h-4" />
              copy task
            </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
