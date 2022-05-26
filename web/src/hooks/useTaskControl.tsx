import { useState } from 'react'
import { DropResult, ResponderProvided, DragStart } from 'react-beautiful-dnd'

export const useTaskControl = () => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)

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
    console.log('******* TITLE *******', title)

    console.log('******* DESCRIPTION *******', description)

    setIsNewTaskModalOpen(false)
  }

  return {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    dragStartHandler,
    dragEndHandler,
    newTaskModalConfirmHandler,
  }
}
