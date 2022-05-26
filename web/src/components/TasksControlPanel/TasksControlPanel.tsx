import React from 'react'
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  DragStart,
} from 'react-beautiful-dnd'
import DoneList from '../DoneList/DoneList'
import InprogressList from '../InprogressList/InprogressList'
import ToDoList from '../TodoList/TodoList'
import cs from 'classnames'

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
          <div className={cs(styles.todoContainer, styles.taskContainers)}>
            <h1 className={styles.listTitle}>TO DO</h1>
            <ToDoList userId={userId} tasks={[]} />
          </div>
          <div
            className={cs(styles.inprogressContainer, styles.taskContainers)}
          >
            <h1 className={styles.listTitle}>IN PROGRESS</h1>
            <InprogressList userId={userId} tasks={[]} />
          </div>
          <div className={cs(styles.doneContainer, styles.taskContainers)}>
            <h1 className={styles.listTitle}>DONE</h1>
            <DoneList userId={userId} tasks={[]} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default TasksControlPanel
