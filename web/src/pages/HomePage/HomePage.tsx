import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="w-full h-full flex flex-col items-center p-20 space-y-5">
        <h1>HomePage</h1>
        <p>
          Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
        </p>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <Link to={routes.logout()}>
              <span className="text-indigo-500 hover:text-indigo-900">
                Logout
              </span>
            </Link>
          ) : (
            <Link to={routes.login()}>
              <span className="text-indigo-500 hover:text-indigo-900">
                Login
              </span>
            </Link>
          )}
          <Link to={routes.signup()}>
            <span className="text-indigo-500 hover:text-indigo-900">
              Signup
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default HomePage
