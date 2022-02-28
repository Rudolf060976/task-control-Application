import { useEffect } from 'react'
import { routes, Link } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

const LogoutPage = () => {
  const { logOut } = useAuth()

  const onLogout = async () => {
    await logOut()
  }

  useEffect(() => {
    onLogout()
  }, [])

  return (
    <div className="flex space-x-4 p-20 w-full justify-center">
      <Link to={routes.login()}>
        <span className="text-indigo-500 hover:text-indigo-900">Login</span>
      </Link>
      <Link to={routes.signup()}>
        <span className="text-indigo-500 hover:text-indigo-900">Signup</span>
      </Link>
    </div>
  )
}

export default LogoutPage
