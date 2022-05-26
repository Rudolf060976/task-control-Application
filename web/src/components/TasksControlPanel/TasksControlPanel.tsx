import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import DoneList from '../DoneList/DoneList'
import InprogressList from '../InprogressList/InprogressList'
import ToDoList from '../TodoList/TodoList'
import cs from 'classnames'

import styles from './TasksControlPanel.module.css'
import { Alert, Button, Snackbar } from '@mui/material'
import NewTaskModal from '../NewTaskModal/NewTaskModal'
import { useTaskControl } from 'src/hooks/useTaskControl'
import TaskToggleButton from '../TaskToggleButton/TaskToggleButton'

type TasksControlPanelProps = {
  userId: number
}

export type TaskFilter = 'all' | 'mine'

const TasksControlPanel: React.FC<TasksControlPanelProps> = ({ userId }) => {
  const {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    dragStartHandler,
    dragEndHandler,
    newTaskModalConfirmHandler,
    isSnackBarOpen,
    snackBarCloseHandler,
    snackBarMessage,
    handleTaskFilter,
    taskFilter,
    todoTaskList,
  } = useTaskControl(userId)

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
        <div className={styles.toggleButtonContainer}>
          <div className={styles.taskFilterLabel}>Tasks to Show:</div>
          <TaskToggleButton value={taskFilter} onChange={handleTaskFilter} />
        </div>
      </div>
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <div className={styles.dragAndDropContainer}>
          <div className={cs(styles.todoContainer, styles.taskContainers)}>
            <h1 className={styles.listTitle}>TO DO</h1>
            <ToDoList userId={userId} tasks={todoTaskList} />
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
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={snackBarCloseHandler}
      >
        <Alert
          onClose={snackBarCloseHandler}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default TasksControlPanel
