import React, { useState, useEffect } from 'react'
import FilledInput from '@mui/material/FilledInput'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import cs from 'classnames'

import styles from './SearchUser.module.css'
import { User } from 'types/graphql'

type SearchUserProps = {
  allUsers: User[]
  onSelectUser: (userId: number) => void
}

const SearchUser: React.FC<SearchUserProps> = ({ allUsers, onSelectUser }) => {
  const [textInput, setTextInput] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [keyPressed, setKeyPressed] = useState<{ key: string }>({
    key: '',
  })

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (!textInput) return setFilteredUsers([])

    const searchRegExp = new RegExp(`\^${textInput.trim()}\\w*`, 'i')

    const newUsers = allUsers.filter((user) => searchRegExp.test(user.email))

    setFilteredUsers(newUsers)
  }, [textInput])

  useEffect(() => {
    setKeyPressed({ key: '' })
  }, [filteredUsers])

  useEffect(() => {
    if (!keyPressed.key) return

    if (keyPressed.key === 'arrowup') return prevSelectedIndex()

    if (keyPressed.key === 'arrowdown') nextSelectedIndex()

    if (keyPressed.key === 'enter') {
      if (filteredUsers.length === 0) return

      const selectedUser = filteredUsers.filter((user, index) => {
        return index === selectedIndex
      })?.[0]

      if (!selectedUser) return

      onSelectUser(selectedUser.id)

      setTextInput('')
    }
  }, [keyPressed])

  const textInputChangeHandler = (input: string) => {
    setTextInput(input)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event?.key?.toLowerCase()

    if (!key) return

    setKeyPressed({ key })
  }

  const nextSelectedIndex = () => {
    if (filteredUsers.length === 0) return

    const maxIndex = filteredUsers.length - 1

    if (selectedIndex > maxIndex) return setSelectedIndex(0)

    setSelectedIndex(selectedIndex + 1)
  }

  const prevSelectedIndex = () => {
    if (filteredUsers.length === 0) return

    const minIndex = 0

    const maxIndex = filteredUsers.length - 1

    if (selectedIndex < minIndex) return setSelectedIndex(maxIndex)

    setSelectedIndex(selectedIndex - 1)
  }

  const listItemMouseClickHandler = (userId: number) => {
    onSelectUser(userId)

    setTextInput('')
  }

  return (
    <div className={styles.mainContainer}>
      <FormControl variant="filled">
        <InputLabel htmlFor="user-search">Search users here..</InputLabel>
        <FilledInput
          id="user-search"
          className={styles.searchInput}
          value={textInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            textInputChangeHandler(event.target.value)
          }
        />
      </FormControl>
      <div className={styles.floatingListContainer}>
        <ul
          className={cs(styles.floatingList, {
            [styles.showList]: filteredUsers.length > 0,
          })}
        >
          {filteredUsers.map((user, index) => {
            return (
              // eslint-disable-next-line
              <li
                key={user.id}
                className={cs(styles.floatingListItem, {
                  [styles.selectedListItem]: selectedIndex === index,
                })}
                onClick={() => listItemMouseClickHandler(user.id)}
              >
                {user.email.substring(0, 40)}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SearchUser
