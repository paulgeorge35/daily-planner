import { Label, Task } from "@prisma/client"
import { createContext, useEffect, useState } from "react"
import {
  TaskContextType,
  TaskAllFields,
  TaskNewTypeOpt,
  LabelNewType,
} from "types"

export const TaskContext = createContext({
  tasks: [],
  setTasks: () => null,
  createTask: (_: TaskNewTypeOpt) => Promise.resolve({} as TaskAllFields),
  updateTask: (_: TaskAllFields) => Promise.resolve({} as TaskAllFields),
  deleteTask: (_: number) => Promise.resolve({} as { id: number }),
  labels: [],
  createLabel: (_: LabelNewType) => Promise.resolve({} as Label),
  updateLabel: (_: Label) => Promise.resolve({} as Label),
  deleteLabel: (_: number) => Promise.resolve({} as { id: number }),
  setLabels: () => null,
  isFetching: false,
} as TaskContextType)

export const TaskContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isFetching, setIsFetching] = useState(false)
  const [tasks, setTasks] = useState<TaskAllFields[]>([])
  const [labels, setLabels] = useState<Label[]>([])

  async function fetchTasks() {
    const res = await (
      await fetch("/api/tasks/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "default",
      })
    ).json()
    return res
  }

  const createTask = async (data: TaskNewTypeOpt): Promise<TaskAllFields> => {
    const res = await (
      await fetch("/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(data),
      })
    ).json()
    if (res) setTasks([res.task, ...tasks])
    return res
  }

  const updateTask = async (data?: TaskAllFields) => {
    if (!data) return
    const res = await (
      await fetch("/api/tasks/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        body: JSON.stringify({
          ...data,
        }),
      })
    ).json()
    if (res) setTasks([...tasks.filter((l) => l.id !== res.task.id), res.task])
    return res
  }

  const deleteTask = async (id: number) => {
    const res = await (
      await fetch(`/api/tasks/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
    ).json()
    if (res) setTasks(tasks.filter((l) => l.id !== res.id))
    return res
  }

  async function fetchLabels() {
    const res = await (
      await fetch("/api/labels/labels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "default",
      })
    ).json()
    return res
  }

  const createLabel = async (data: LabelNewType) => {
    const res = await (
      await fetch("/api/labels/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: data.name,
          color: data.color,
        }),
      })
    ).json()
    if (res) setLabels([...labels, res.label])
    return res
  }

  const updateLabel = async (data?: Label) => {
    if (!data) return
    const res = await (
      await fetch("/api/labels/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        body: JSON.stringify({
          ...data,
        }),
      })
    ).json()
    if (res)
      setLabels([...labels.filter((l) => l.id !== res.label.id), res.label])
    return res
  }

  const deleteLabel = async (id: number) => {
    const res = await (
      await fetch(`/api/labels/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
    ).json()
    if (res) setLabels(labels.filter((l) => l.id !== res.id))
    return res
  }

  const fetchData = async () => {
    setIsFetching(true)
    const { tasks } = await fetchTasks()
    const { labels } = await fetchLabels()
    setTasks(tasks)
    setLabels(labels)
    setIsFetching(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const value = {
    tasks,
    setTasks: (tasks: TaskAllFields[]) => setTasks(tasks),
    createTask,
    updateTask,
    deleteTask,
    labels,
    createLabel,
    updateLabel,
    deleteLabel,
    setLabels: (labels: Label[]) => setLabels(labels),
    isFetching,
  }
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
