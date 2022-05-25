//import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import {
  MutationcreateTaskArgs,
  MutationdeleteTaskArgs,
  MutationassignTaskArgs,
  MutationcompleteTaskArgs,
} from '../../../types/graphql'

export const getAllPendingTasks = async () => {
  return await db.task.findMany({
    where: {
      status: 'todo',
      isCompleted: false,
    },
  })
}

export const getTasksCreatedByUser = async ({ userId }: { userId: number }) => {
  return await db.task.findMany({
    where: {
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
