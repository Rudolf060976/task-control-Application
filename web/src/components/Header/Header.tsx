import React from 'react'
import Avatar from '@mui/material/Avatar'
import { deepOrange } from '@mui/material/colors'
import { Link, routes } from '@redwoodjs/router'

import styles from './Header.module.css'
import { Button } from '@mui/material'

type HeaderProps = {
  userName: string
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.appNameContainer}>
        <h1 className={styles.appNameTitle}>NIMIX</h1>
        <h4 className={styles.appNameSlogan}>
          The Task Tracker App your Team Needs
        </h4>
      </div>
      <div className={styles.userContainer}>
        <div className={styles.userFlexbox}>
          <Avatar sx={{ bgcolor: deepOrange[500], width: 30, height: 30 }}>
            {userName.substring(0, 1).toUpperCase()}
          </Avatar>
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>
      <div className={styles.navContainer}>
        <span className={styles.logoutContainer}>
          <Link to={routes.logout()}>
            <Button variant="outlined" color="inherit">
              Log Out
            </Button>
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Header
