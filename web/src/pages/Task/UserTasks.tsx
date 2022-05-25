import React from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'

import TaskLayout from 'src/layouts/UsersLayout/TaskLayout'
import TasksControlPanel from 'src/components/TasksControlPanel/TasksControlPanel'

export const QUERY = gql`
  query FindUserById($id: Int!) {
    user: user(id: $id) {
      id
      email
      hashedPassword
      salt
      resetToken
      resetTokenExpiresAt
    }
  }
`

const UserTasks: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth()

  const {
    loading,
    error,
    data: userData,
  } = useQuery(QUERY, {
    variables: {
      id: currentUser.id,
    },
  })

  if (!isAuthenticated) navigate(routes.login())

  if (loading) return <div>LOADING.....</div>

  if (error) return <div>ERROR</div>

  return (
    <TaskLayout userName={userData.user.email}>
      <TasksControlPanel userId={currentUser.id} />
    </TaskLayout>
  )
}

export default UserTasks
