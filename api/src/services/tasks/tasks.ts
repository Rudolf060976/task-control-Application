//import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import {
  MutationcreateTaskArgs,
  MutationdeleteTaskArgs,
  MutationassignTaskArgs,
  MutationcompleteTaskArgs,
  MutationarchiveTasksArgs,
  MutationupdateTaskPositionsArgs,
} from 'types/graphql'

export const getAllTasks = async () => {
  return await db.task.findMany({
    where: {
      isArchived: false,
    },
  })
}

export const getAllPendingTasks = async () => {
  return await db.task.findMany({
    where: {
      status: 'todo',
    },
  })
}

export const getTasksCreatedByUser = async ({ userId }: { userId: number }) => {
  return await db.task.findMany({
    where: {
      status: 'todo',
      createdById: userId,
    },
  })
}

export const getTasksAssignedToUser = async ({
  userId,
}: {
  userId: number
}) => {
  return await db.task.findMany({
    where: {
      assignedToId: userId,
      isArchived: false,
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
      status: 'inprogress',
    },
  })
}

export const completeTask = async ({
  userId,
  taskId,
}: MutationcompleteTaskArgs) => {
  const existingTask = await db.task.findFirst({
    where: {
      id: taskId,
    },
  })

  if (!existingTask) return null

  const { status, assignedToId, isCompleted } = existingTask

  if (status !== 'inprogress' || isCompleted || assignedToId !== userId)
    return null

  return await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: 'done',
      isCompleted: true,
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

  await Promise.all(
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
