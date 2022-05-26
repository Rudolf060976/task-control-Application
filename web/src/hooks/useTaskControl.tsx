import { useState } from 'react'
import { DropResult, ResponderProvided, DragStart } from 'react-beautiful-dnd'
import { useMutation } from '@redwoodjs/web'
import { CREATE_TASK_MUTATION } from 'src/graphql/task/mutation'
import { TaskFilter } from 'src/components/TasksControlPanel/TasksControlPanel'

export const useTaskControl = (userId: number) => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('mine')

  const [createTask] = useMutation(CREATE_TASK_MUTATION)

  const dragStartHandler = (
    initial: DragStart,
    provided: ResponderProvided
  ) => {
    return !initial || !provided
  }

  const dragEndHandler = (result: DropResult, provided: ResponderProvided) => {
    return !result || !provided
  }

  const newTaskModalConfirmHandler = (title: string, description: string) => {
    createTask({
      variables: {
        userId,
        input: {
          title,
          description,
        },
      },
    })
    setSnackBarMessage('Your task was created successfully!')
    setIsNewTaskModalOpen(false)
  }

  const isSnackBarOpen = !!snackBarMessage
  const snackBarCloseHandler = () => {
    setSnackBarMessage(null)
  }

  const handleTaskFilter = (filterValue: TaskFilter) => {
    setTaskFilter(filterValue)
  }

  return {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    dragStartHandler,
    dragEndHandler,
    newTaskModalConfirmHandler,
    isSnackBarOpen,
    snackBarCloseHandler,
    snackBarMessage: snackBarMessage || '',
    handleTaskFilter,
    taskFilter,
  }
}
