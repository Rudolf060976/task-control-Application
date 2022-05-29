import React from 'react'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd'
import { Task, User } from 'types/graphql'
import TaskTile from '../TaskTile/TaskTile'
import cs from 'classnames'

import styles from './DoneList.module.css'

type DoneListProps = {
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

const DoneList: React.FC<DoneListProps> = ({
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
    <Droppable droppableId="doneList" isDropDisabled={isDropDisabled}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <ul
          ref={provided.innerRef}
          className={cs(styles.mainContainer, {
            [styles.isDraggingOver]: snapshot.isDraggingOver,
          })}
          {...provided.droppableProps}
        >
          {tasks.map((task, index) => {
            return (
              <TaskTile
                index={index}
                key={task.id}
                task={task}
                userList={userList}
                userId={userId}
                droppableId="doneList"
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

export default DoneList
