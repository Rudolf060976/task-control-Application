import React from 'react'
import { Task } from 'types/graphql'

import styles from './InprogressList.module.css'

type InprogressListProps = {
  userId: number
  tasks: Task[]
}

const InprogressList: React.FC<InprogressListProps> = ({ userId, tasks }) => {
  return <ul className={styles.mainContainer}></ul>
}

export default InprogressList
