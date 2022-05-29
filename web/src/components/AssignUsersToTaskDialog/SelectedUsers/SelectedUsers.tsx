import React from 'react'
import { User } from 'types/graphql'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

import styles from './SelectedUsers.module.css'

type SelectedUsersProps = {
  users: User[]
  onRemove: (userId: number) => void
}

const SelectedUsers: React.FC<SelectedUsersProps> = ({ users, onRemove }) => {
  if (users.length === 0) {
    return (
      <div className={styles.emptyListContainer}>
        <span
          className={styles.emptyCenter}
        >{`There's nothing here so far...`}</span>
      </div>
    )
  }

  return (
    <ul className={styles.listContainer}>
      {users.map((user) => {
        return (
          <li key={user.id} className={styles.listItem}>
            {user.email.substring(0, 40)}
            <RemoveCircleOutlineIcon
              className={styles.removeIcon}
              onClick={() => onRemove(user.id)}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default SelectedUsers
