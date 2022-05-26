import React from 'react'
import { Task, User } from 'types/graphql'
import TaskTile from '../TaskTile/TaskTile'

import styles from './TodoList.module.css'

type ToDoListProps = {
  userId: number
  userList: User[]
  tasks: Task[]
}

const ToDoList: React.FC<ToDoListProps> = ({ userId, tasks, userList }) => {
  return (
    <ul className={styles.mainContainer}>
      {tasks.map((task) => {
        return <TaskTile key={task.id} task={task} userList={userList} />
      })}
    </ul>
  )
}

export default ToDoList
