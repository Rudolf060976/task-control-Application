import React from 'react'
import { Task, User } from 'types/graphql'
import VisibilityIcon from '@mui/icons-material/Visibility'

import styles from './TaskTile.module.css'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

type TaskTileProps = {
  task: Task
  userList: User[]
}

const TaskTile: React.FC<TaskTileProps> = ({ task, userList }) => {
  const { title, createdAt, description, createdById, assignedToId } = task

  const creatorUser =
    userList.find((user) => user.id === createdById)?.email || ''

  const assignedToUser =
    userList.find((user) => user.id === assignedToId)?.email || ''

  return (
    <li className={styles.mainContainer}>
      <span className={styles.titleArea}>{title}</span>
      <span className={styles.dateArea}>{`Created: ${createdAt.substring(
        0,
        10
      )}`}</span>
      <span className={styles.creatorArea}>{`Author: ${creatorUser}`}</span>
      <span
        className={styles.assignedArea}
      >{`Assigned To: ${assignedToUser}`}</span>
      <span className={styles.descripArea}>
        {`Description:`}
        <HtmlTooltip
          title={
            <>
              <Typography fontSize={14} color="inherit">
                Description:
              </Typography>
              <p>{description}</p>
            </>
          }
        >
          <VisibilityIcon className={styles.descriptionIcon} />
        </HtmlTooltip>
      </span>
    </li>
  )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))

export default TaskTile
