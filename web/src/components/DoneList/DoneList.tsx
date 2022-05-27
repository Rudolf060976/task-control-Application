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
}

const DoneList: React.FC<DoneListProps> = ({ userId, tasks, userList }) => {
  return (
    <Droppable droppableId="doneList">
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
                droppableId="doneList"
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
