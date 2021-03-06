import React from 'react'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd'
import { Task, User } from 'types/graphql'
import TaskTile from '../TaskTile/TaskTile'

import styles from './TodoList.module.css'
import cs from 'classnames'

type ToDoListProps = {
  userId: number
  userList: User[]
  tasks: Task[]
  isDropDisabled: boolean
  onDeleteTask: (taskId: number) => void
  onAssignTaskToMe: (taskId: number, currentUsers: User[]) => void
  onUnassignMe: (taskId: number) => void
  onUnassignTask: (taskId: number) => void
  onAssignTask: (taskId: number, currentUsers: User[]) => void
  refreshTasks: boolean
}

const ToDoList: React.FC<ToDoListProps> = ({
  userId,
  tasks,
  userList,
  isDropDisabled,
  onDeleteTask,
  onAssignTaskToMe,
  onUnassignMe,
  onUnassignTask,
  onAssignTask,
  refreshTasks,
}) => {
  return (
    <Droppable droppableId="todoList" isDropDisabled={isDropDisabled}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={cs(styles.mainContainer, {
            [styles.isDraggingOver]: snapshot.isDraggingOver,
          })}
        >
          {tasks.map((task, index) => {
            return (
              <TaskTile
                key={task.id}
                index={index}
                task={task}
                userList={userList}
                userId={userId}
                droppableId="todoList"
                onDeleteTask={onDeleteTask}
                onAssignTaskToMe={onAssignTaskToMe}
                onUnassignMe={onUnassignMe}
                onUnassignTask={onUnassignTask}
                onAssignTask={onAssignTask}
                refreshTasks={refreshTasks}
              />
            )
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  )
}

export default ToDoList
