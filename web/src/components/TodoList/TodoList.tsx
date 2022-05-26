import React from 'react'
import { Task } from 'types/graphql'

import styles from './TodoList.module.css'

type ToDoListProps = {
  userId: number
  tasks: Task[]
}

const ToDoList: React.FC<ToDoListProps> = ({ userId, tasks }) => {
  return <ul className={styles.mainContainer}></ul>
}

export default ToDoList
