import { Task } from 'types/graphql'

export const updateUserTaskPositions = (
  allTasks: Task[],
  userTasks: Task[],
  newTask?: Task
): Task[] => {
  const sortedTasks = allTasks.reduce((newList, task) => {
    if (newTask && newTask.id === task.id) return [...newList, newTask]

    if (userTasks.some((userTask) => userTask.id === task.id)) {
      return [...newList, task]
    }

    return [...newList]
  }, [])

  return sortedTasks.map((task, index) => {
    return {
      ...task,
      position: index,
    }
  })
}

export const filterOtherUsersTasks = (
  allTasks: Task[],
  userTasks: Task[]
): Task[] => {
  return allTasks.filter(
    (task) => !userTasks.some((userTask) => userTask.id === task.id)
  )
}

export const getSortedTasksByPosition = (tasks: Task[]): Task[] => {
  return [...tasks].sort((taskA, taskB) => taskA.position - taskB.position)
}
