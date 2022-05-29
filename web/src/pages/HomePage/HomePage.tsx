import { useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'

import styles from './HomePage.module.css'
import { Button } from '@mui/material'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <div className={styles.logoContainer}>
            <img
              src="/images/logoNimix2.png"
              alt="logoNimix"
              className={styles.logo}
            />
            <h4 className={styles.slogan}>
              NIMIX 1 - The Task Tracker App your Team Needs
            </h4>
          </div>
          <div className={styles.loginContainer}>
            {isAuthenticated ? (
              <Link to={routes.logout()}>
                <Button variant="contained" className={styles.loginButton}>
                  Log out
                </Button>
              </Link>
            ) : (
              <>
                <Link to={routes.login()}>
                  <Button variant="contained" className={styles.loginButton}>
                    Log in
                  </Button>
                </Link>
                <Link to={routes.signup()}>
                  <Button variant="outlined" className={styles.logoutButton}>
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.section1}>
            <div className={styles.section1Left}>
              <h2 className={styles.setion1Title}>
                Nimix 1 helps teams to get work done as a unit.
              </h2>
              <p className={styles.setion1Content}>
                From home projects to small offices, you need a way to let your
                Team know how to move forward.
              </p>
            </div>
            <div className={styles.section1Right}>
              <img
                src="/images/teamwork2.png"
                alt="logoNimix"
                className={styles.section1Image}
              />
            </div>
          </section>
          <section className={styles.section2}>
            <h2 className={styles.setion2Title}>
              A new way of working together
            </h2>
            <p className={styles.setion2Content}>
              Just create your tasks, assign them to everyone in your Team and
              increase your performance.
            </p>
            <div className={styles.startButtonContainer}>
              <Link to={routes.login()}>
                <Button variant="outlined" className={styles.letstryButton}>
                  Get Started!
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  )
}

export default HomePage
