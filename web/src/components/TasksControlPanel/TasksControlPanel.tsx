import React, { useState } from 'react'
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
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import NewTaskModal from '../NewTaskModal/NewTaskModal'

type TasksControlPanelProps = {
  userId: number
}

const TasksControlPanel: React.FC<TasksControlPanelProps> = ({ userId }) => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)

  const dragStartHandler = (
    initial: DragStart,
    provided: ResponderProvided
  ) => {
    return !initial || !provided || userId
  }

  const dragEndHandler = (result: DropResult, provided: ResponderProvided) => {
    return !result || !provided
  }

  const newTaskModalConfirmHandler = (title: string, description: string) => {
    console.log('******* TITLE *******', title)

    console.log('******* DESCRIPTION *******', description)

    setIsNewTaskModalOpen(false)
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.controlsContainer}>
        <Button
          variant="contained"
          className={styles.createTaskButton}
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          New Task
        </Button>
        <FormControl>
          <FormLabel id="task-filter">Tasks to show</FormLabel>
          <RadioGroup
            aria-labelledby="tasksFilterGroup"
            defaultValue="all"
            name="taskFilterGroup"
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All Tasks"
            />
            <FormControlLabel
              value="mine"
              control={<Radio />}
              label="My Tasks"
            />
          </RadioGroup>
        </FormControl>
      </div>
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
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onConfirm={newTaskModalConfirmHandler}
      />
    </div>
  )
}

export default TasksControlPanel
