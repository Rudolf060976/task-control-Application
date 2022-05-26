import React from 'react'
import { Task } from 'types/graphql'

import styles from './DoneList.module.css'

type DoneListProps = {
  userId: number
  tasks: Task[]
}

const DoneList: React.FC<DoneListProps> = ({ userId, tasks }) => {
  return <ul className={styles.mainContainer}></ul>
}

export default DoneList
