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
}

const ToDoList: React.FC<ToDoListProps> = ({ userId, tasks, userList }) => {
  return (
    <Droppable droppableId="todoList">
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
