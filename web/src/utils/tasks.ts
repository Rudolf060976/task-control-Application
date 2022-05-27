import { Task } from 'types/graphql'

export const filterTodoTasksByLoggedUserAndUpdatePositions = (
  tasks: Task[],
  userId: number
): Task[] => {
  const userTasks = tasks.filter((task) => task.createdById === userId)

  const newUserTasks = userTasks.map((task, index) => {
    return {
      ...task,
      position: index,
    }
  })

  return newUserTasks
}

export const getSortedTasksByPosition = (tasks: Task[]): Task[] => {
  return tasks.sort((taskA, taskB) => taskA.position - taskB.position)
}
