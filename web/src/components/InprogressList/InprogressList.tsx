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
}

const InprogressList: React.FC<InprogressListProps> = ({
  userId,
  tasks,
  userList,
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
