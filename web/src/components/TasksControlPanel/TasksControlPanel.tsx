import React from 'react'
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  DragStart,
} from 'react-beautiful-dnd'
import ToDoList from '../ToDoList/ToDoList'

import styles from './TasksControlPanel.module.css'

type TasksControlPanelProps = {
  userId: number
}

const TasksControlPanel: React.FC<TasksControlPanelProps> = ({ userId }) => {
  const dragStartHandler = (
    initial: DragStart,
    provided: ResponderProvided
  ) => {
    return !initial || !provided || userId
  }

  const dragEndHandler = (result: DropResult, provided: ResponderProvided) => {
    return !result || !provided
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.controlsContainer}></div>
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <div className={styles.dragAndDropContainer}>
          <div className={styles.todoContainer}></div>
          <div className={styles.inprogressContainer}></div>
          <div className={styles.doneContainer}></div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default TasksControlPanel
