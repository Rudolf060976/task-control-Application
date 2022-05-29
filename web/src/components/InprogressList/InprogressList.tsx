import React from 'react'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd'
import { Task, User } from 'types/graphql'
import TaskTile from '../TaskTile/TaskTile'

import styles from './InprogressList.module.css'
import cs from 'classnames'

type InprogressListProps = {
  userId: number
  userList: User[]
  tasks: Task[]
  onDeleteTask: (taskId: number) => void
  onAssignTaskToMe: (taskId: number, currentUsers: User[]) => void
  onUnassignMe: (taskId: number) => void
  onUnassignTask: (taskId: number) => void
  onAssignTask: (taskId: number, assignedUsers: User[]) => void
  refreshTasks: boolean
}

const InprogressList: React.FC<InprogressListProps> = ({
  userId,
  tasks,
  userList,
  onDeleteTask,
  onAssignTaskToMe,
  onUnassignMe,
  onUnassignTask,
  onAssignTask,
  refreshTasks,
}) => {
  return (
    <Droppable droppableId="inprogressList">
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
                key={task.id}
                index={index}
                task={task}
                userList={userList}
                userId={userId}
                droppableId="inprogressList"
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

export default InprogressList
