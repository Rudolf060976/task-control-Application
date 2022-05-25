import Header from 'src/components/Header/Header'

import styles from './TaskLayout.module.css'

type TaskLayoutProps = {
  userName: string
  children: React.ReactNode
}

const TaskLayout = ({ children, userName }: TaskLayoutProps) => {
  return (
    <div className={styles.mainContainer}>
      <Header userName={userName} />
      <main className="w-full p-6">{children}</main>
    </div>
  )
}

export default TaskLayout
