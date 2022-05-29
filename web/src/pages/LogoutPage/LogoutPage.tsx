import { useState } from 'react'
import { routes, navigate } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import styles from './LogoutPage.module.css'

const LogoutPage = () => {
  const { logOut } = useAuth()

  const [counter, setCounter] = useState(2)

  const updateCounter = () => {
    if (counter === 0) {
      ;(async function () {
        clearInterval(intervalID)
        await logOut()
        navigate(routes.home())
      })()

      return
    }

    setCounter(counter - 1)
  }

  const intervalID = setInterval(updateCounter, 1000)

  return (
    <div className={styles.mainContainer}>
      <img
        src="/images/logoutImage.jpeg"
        alt="logout"
        className={styles.logoutImage}
      />
      <h1 className={styles.counterMessage}>
        {`Redirecting to Home Page in ${counter} seconds`}
      </h1>
    </div>
  )
}

export default LogoutPage
