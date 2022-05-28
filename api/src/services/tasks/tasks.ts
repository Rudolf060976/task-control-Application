//import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import {
  MutationcreateTaskArgs,
  MutationdeleteTaskArgs,
  MutationassignTaskArgs,
  MutationarchiveTasksArgs,
  MutationupdateTaskPositionsArgs,
  MutationchangeTaskStatusArgs,
  QuerygetAllTasksByStatusArgs,
  QuerygetUserTasksByStatusArgs,
  QuerygetAssignedUsersByTaskArgs,
  MutationunassignTaskByUserArgs,
} from 'types/graphql'

export const getAllTasksByStatus = async ({
  status,
}: QuerygetAllTasksByStatusArgs) => {
  return await db.task.findMany({
    where: {
      status,
      isArchived: false,
    },
  })
}

export const getUserTasksByStatus = async ({
  status,
  userId,
}: QuerygetUserTasksByStatusArgs) => {
  return await db.task.findMany({
    where: {
      status,
      OR: [
        {
          createdById: {
            equals: userId,
          },
        },
        {
          assignedUsers: {
            some: {
              userId: {
                equals: userId,
              },
            },
          },
        },
      ],
    },
  })
}

export const getAssignedUsersByTask = async ({
  taskId,
}: QuerygetAssignedUsersByTaskArgs) => {
  return await db.user.findMany({
    where: {
      assignedTasks: {
        some: {
          taskId: {
            equals: taskId,
          },
        },
      },
    },
  })
}

export const createTask = async ({ userId, input }: MutationcreateTaskArgs) => {
  const { title, description } = input

  const newTask = await db.task.create({
    data: {
      title,
      description,
      assignedUsers: {
        create: [],
      },
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return newTask
}

export const deleteTask = async ({
  userId,
  taskId,
}: MutationdeleteTaskArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })
  // Only the Author of the Task can delete it.
  if (!existingTask || existingTask.createdById !== userId) return false

  await db.task.delete({
    where: {
      id: taskId,
    },
  })
  return true
}

export const deleteAllTasks = async () => {
  await db.task.deleteMany()
  return true
}

export const assignTask = async ({
  userIds,
  taskId,
}: MutationassignTaskArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })

  if (!existingTask) return null

  const { status, isCompleted } = existingTask

  if (status !== 'todo' || isCompleted) return null

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedUsers: {
        deleteMany: {},
        create: userIds.map((userId) => ({
          userId,
          taskId,
        })),
      },
    },
  })
}

export const changeTaskStatus = async ({
  userId,
  taskId,
  status,
}: MutationchangeTaskStatusArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })

  if (!existingTask) return null

  const { status: oldStatus, createdById, isCompleted } = existingTask

  const assignedUsers = await getAssignedUsersByTask({ taskId })

  const isTaskAssignedToUser = assignedUsers.some((user) => user.id === userId)

  if (status === 'done') {
    if (
      oldStatus !== 'inprogress' ||
      isCompleted ||
      (!isTaskAssignedToUser && createdById !== userId)
    )
      return null
  }

  if (status === 'inprogress' || status === 'todo') {
    if (!isTaskAssignedToUser && createdById !== userId) return null
  }

  if (status === 'archived') {
    if (oldStatus !== 'done') return null
  }

  const getCompletedBy = () => {
    if (status === 'done') {
      return {
        connect: { id: userId },
      }
    }

    return null
  }

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
      isCompleted: status === 'done' ? true : false,
      isArchived: status === 'archived' ? true : false,
      completedBy: getCompletedBy(),
      completedAt: status === 'done' ? null : new Date(),
    },
  })
}

export const unassignTask = async ({ taskId }: MutationassignTaskArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })

  if (!existingTask) return null

  const { status, isCompleted } = existingTask

  if (status !== 'inprogress' || isCompleted) return null

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedUsers: {
        deleteMany: {},
      },
    },
  })
}

export const archiveTasks = async ({ taskIds }: MutationarchiveTasksArgs) => {
  const existingTasks = await db.task.findMany({
    where: {
      id: { in: taskIds },
    },
  })

  if (!existingTasks || existingTasks.length === 0) return false

  const areAllTasksCompleted = existingTasks.every(
    (task) => task.status === 'done' && task.isCompleted
  )

  if (!areAllTasksCompleted) return false

  await db.task.updateMany({
    where: {
      id: { in: taskIds },
    },
    data: {
      status: 'archived',
      isArchived: true,
    },
  })

  return true
}

export const updateTaskPositions = async ({
  input,
}: MutationupdateTaskPositionsArgs) => {
  const taskPositions = input
  await db.$transaction(
    taskPositions.map((taskPosition) => {
      return db.task.update({
        where: {
          id: taskPosition.id,
        },
        data: {
          position: taskPosition.position,
        },
      })
    })
  )

  return true
}

export const unassignTaskByUser = async ({
  taskId,
  userId,
}: MutationunassignTaskByUserArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })

  if (!existingTask) return null

  const { isCompleted } = existingTask

  if (isCompleted) return null

  const assignedUsers = await getAssignedUsersByTask({ taskId })

  const restOfUsers = assignedUsers.filter((user) => user.id !== userId)

  await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedUsers: {
        deleteMany: {},
        create: restOfUsers.map((user) => ({
          userId: user.id,
          taskId,
        })),
      },
    },
  })
  return true
}
