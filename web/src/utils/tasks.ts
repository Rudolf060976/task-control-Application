import { Task } from 'types/graphql'

export const filterUserTasksAndUpdatePositions = (
  tasks: Task[],
  userId: number
): Task[] => {
  const userTasks = tasks.filter((task) => {
    return task.createdById === userId || task.assignedToId === userId
  })

  const newUserTasks = userTasks.map((task, index) => {
    return {
      ...task,
      position: index,
    }
  })

  return newUserTasks
}

export const filterOtherUsersTasks = (
  tasks: Task[],
  userId: number
): Task[] => {
  return tasks.filter(
    (task) => task.createdById !== userId && task.assignedToId !== userId
  )
}

export const getSortedTasksByPosition = (tasks: Task[]): Task[] => {
  return [...tasks].sort((taskA, taskB) => taskA.position - taskB.position)
}
