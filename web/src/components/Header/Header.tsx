import React from 'react'

import styles from './Header.module.css'

type HeaderProps = {
  userName: string
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.appNameContainer}>APP NAME</div>
      <div className={styles.userContainer}>USER NAME ${userName}</div>
      <div className={styles.navContainer}>NAV LINKS</div>
    </div>
  )
}

export default Header
