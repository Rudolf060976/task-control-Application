import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import styles from './AssignUsersToTaskDialog.module.css'
import { User } from 'types/graphql'
import SelectedUsers from './SelectedUsers/SelectedUsers'
import SearchUser from './SearchUser/SearchUser'

type AssignUsersToTaskProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (users: User[]) => void
  currentUsers: User[]
  allUsers: User[]
}

const AssignUsersToTask: React.FC<AssignUsersToTaskProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentUsers,
  allUsers,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  useEffect(() => {
    if (isOpen) setSelectedUsers(currentUsers)
  }, [isOpen])

  const confirmHandler = () => {
    if (selectedUsers.length === 0) return

    onConfirm(selectedUsers)
  }

  const removeUserHandler = (userId: number) => {
    const filteredUsers = selectedUsers.filter((user) => user.id !== userId)

    setSelectedUsers(filteredUsers)
  }

  const selectUserHandler = (userId: number) => {
    const isUserSelected = !!selectedUsers.find((user) => user.id === userId)

    if (isUserSelected) return

    const newUser = allUsers.find((user) => user.id === userId)

    if (!newUser) return

    const newSelectedUsers = [...selectedUsers, newUser]

    setSelectedUsers(newSelectedUsers)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Assign Task to Users</DialogTitle>
      <DialogContent className={styles.mainContent}>
        <SearchUser allUsers={allUsers} onSelectUser={selectUserHandler} />
        <SelectedUsers users={selectedUsers} onRemove={removeUserHandler} />
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmHandler} disabled={selectedUsers.length === 0}>
          Confirm
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignUsersToTask
