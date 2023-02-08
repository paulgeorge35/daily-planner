import { cn } from "@/lib/utils"
import { Label, Subtask, Task } from "@prisma/client"
import { useState } from "react"
import { PickAndFlatten } from "types"
import Checkbox from "./checkbox"
import SubtaskSection from "./task/subtask-section"
import TaskShortActions from "./task/task-short-actions"
import TimePreview from "./task/task-time-preview"

type TaskProps = {
  data: PickAndFlatten<Task & { subtasks: Subtask[]; label: Label }>
  className?: string
}

const Task = ({ data, className }: TaskProps) => {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false)
  const [extended, setExtended] = useState<boolean>(false)
  return (
    <span
      className={cn(
        "group flex w-full cursor-pointer flex-col rounded-xl border p-3",
        "border-neutral-200 bg-white text-neutral-800",
        "hover:border-blue-200 hover:shadow-md",
        "dark:border-neutral-800 dark:bg-neutral-800 dark:text-white",
        "dark:hover:border-neutral-600",
        className
      )}
    >
      <span className="flex flex-row items-center">
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
        <p className={cn("grow px-2 text-xs")}>{data.title}</p>
        <TimePreview actual={data.actual} estimate={data.estimate} />
      </span>
      <TaskShortActions
        data={data}
        extended={extended}
        toggleExtended={() => setExtended(!extended)}
      />
      <SubtaskSection extended={extended} subtasks={data.subtasks} />
    </span>
  )
}

export default Task
