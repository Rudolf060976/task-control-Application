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
import TaskCounter from '../TaskCounter/TaskCounter'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import AssignUsersToTaskDialog from '../AssignUsersToTaskDialog/AssignUsersToTaskDialog'

export type DroppableId = 'todoList' | 'inprogressList' | 'doneList'

type TasksControlPanelProps = {
  userId: number
}

export type TaskFilter = 'all' | 'mine'

export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'archived'

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
    userList,
    inprogressTaskList,
    doneTaskList,
    isTodoListDropDisabled,
    isDoneListDropDisabled,
    deleteTaskHandler,
    assignTaskToMeHandler,
    unassignTaskHandler,
    assignTaskHandler,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    dataOnProcess,
    confirmationModalConfirmHandler,
    unassignTaskToMeHandler,
    refreshTasks,
    handleArchiveTasks,
    isAssignUsersModalOpen,
    setIsAssignUsersModalOpen,
    assignUsersModalConfirmHandler,
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
        <Button
          variant="contained"
          className={styles.createTaskButton}
          onClick={handleArchiveTasks}
        >
          Archive User`s Done Tasks
        </Button>
      </div>
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragUpdate={() => null}
        onDragEnd={dragEndHandler}
      >
        <div className={styles.dragAndDropContainer}>
          <div className={cs(styles.todoContainer, styles.taskContainers)}>
            <div className={styles.counterContainer}>
              <TaskCounter count={todoTaskList.length} />
            </div>
            <h1 className={styles.listTitle}>TO DO</h1>
            <ToDoList
              userId={userId}
              tasks={todoTaskList}
              userList={userList}
              isDropDisabled={isTodoListDropDisabled}
              onDeleteTask={deleteTaskHandler}
              onAssignTaskToMe={assignTaskToMeHandler}
              onUnassignMe={unassignTaskToMeHandler}
              onUnassignTask={unassignTaskHandler}
              onAssignTask={assignTaskHandler}
              refreshTasks={refreshTasks}
            />
          </div>
          <div
            className={cs(styles.inprogressContainer, styles.taskContainers)}
          >
            <div className={styles.counterContainer}>
              <TaskCounter count={inprogressTaskList.length} />
            </div>
            <h1 className={styles.listTitle}>IN PROGRESS</h1>
            <InprogressList
              userId={userId}
              tasks={inprogressTaskList}
              userList={userList}
              onDeleteTask={deleteTaskHandler}
              onAssignTaskToMe={assignTaskToMeHandler}
              onUnassignMe={unassignTaskToMeHandler}
              onUnassignTask={unassignTaskHandler}
              onAssignTask={assignTaskHandler}
              refreshTasks={refreshTasks}
            />
          </div>
          <div className={cs(styles.doneContainer, styles.taskContainers)}>
            <div className={styles.counterContainer}>
              <TaskCounter count={doneTaskList.length} />
            </div>
            <h1 className={styles.listTitle}>DONE</h1>
            <DoneList
              userId={userId}
              tasks={doneTaskList}
              userList={userList}
              isDropDisabled={isDoneListDropDisabled}
              onDeleteTask={deleteTaskHandler}
              onAssignTaskToMe={assignTaskToMeHandler}
              onUnassignMe={unassignTaskToMeHandler}
              onUnassignTask={unassignTaskHandler}
              onAssignTask={assignTaskHandler}
              refreshTasks={refreshTasks}
            />
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
        autoHideDuration={2000}
        onClose={snackBarCloseHandler}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={snackBarCloseHandler}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        message={dataOnProcess?.confirmMessage || ''}
        onConfirm={confirmationModalConfirmHandler}
      />
      <AssignUsersToTaskDialog
        isOpen={isAssignUsersModalOpen}
        onClose={() => setIsAssignUsersModalOpen(false)}
        onConfirm={assignUsersModalConfirmHandler}
        currentUsers={dataOnProcess?.currentUsers || []}
        allUsers={dataOnProcess?.allUsers || []}
      />
    </div>
  )
}

export default TasksControlPanel
