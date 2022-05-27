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
          assignedToId: {
            equals: userId,
          },
        },
      ],
    },
  })
}

export const createTask = async ({ userId, input }: MutationcreateTaskArgs) => {
  const { title, description } = input

  const newTask = await db.task.create({
    data: {
      title,
      description,
      createdById: userId,
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
  userId,
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
      assignedToId: userId,
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

  const {
    status: oldStatus,
    assignedToId,
    createdById,
    isCompleted,
  } = existingTask

  if (status === 'done') {
    if (
      oldStatus !== 'inprogress' ||
      isCompleted ||
      (assignedToId !== userId && createdById !== userId)
    )
      return null
  }

  if (status === 'inprogress' || status === 'todo') {
    if (assignedToId !== userId && createdById !== userId) return null
  }

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
      isCompleted: status === 'done' ? true : false,
      isArchived: status === 'archived' ? true : false,
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
      assignedToId: null,
      status: 'todo',
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
