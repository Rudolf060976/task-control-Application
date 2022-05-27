import React from 'react'

import styles from './TaskCounter.module.css'

type TaskCounterProps = {
  count: number
}

const TaskCounter: React.FC<TaskCounterProps> = ({ count }) => {
  return <span className={styles.mainContainer}>{count}</span>
}

export default TaskCounter
