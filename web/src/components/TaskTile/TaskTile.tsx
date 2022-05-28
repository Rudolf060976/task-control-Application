import React, { useEffect, useState } from 'react'
import { Task, User } from 'types/graphql'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

import styles from './TaskTile.module.css'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import cs from 'classnames'
import { DroppableId } from '../TasksControlPanel/TasksControlPanel'
import { getAssignedUsersByTask } from 'src/graphql/task/services'
import { useApolloClient } from '@apollo/client'

type TaskTileProps = {
  task: Task
  index: number
  userList: User[]
  userId: number
  droppableId: DroppableId
  preventDragging?: boolean
}

const TaskTile: React.FC<TaskTileProps> = ({
  task,
  index,
  userList,
  userId,
  droppableId,
  preventDragging,
}) => {
  const [assignedUsers, setAssignedUsers] = useState<User[]>([])

  const apolloClient = useApolloClient()

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAssignedUsersByTask(task.id, apolloClient)

      setAssignedUsers(users)
    }

    fetchData()
  }, [])

  const { title, createdAt, description, createdById } = task

  const creatorUser =
    userList.find((user) => user.id === createdById)?.email || ''

  const isCreatedByMe = createdById === userId

  const isAssignedToMe = assignedUsers.some((user) => user.id === userId)

  const getAssignedTo = () => {
    if (isAssignedToMe) {
      if (assignedUsers.length === 1) return 'ME'

      return `ME and ${assignedUsers.length - 1} Users`
    }

    if (assignedUsers.length > 0) return `${assignedUsers.length} Users`

    return ''
  }

  const getIsEditUsersIconActive = () => {
    if (droppableId === 'doneList' || !isCreatedByMe) return false

    return true
  }

  const getIsDeleteUsersIconActive = () => {
    if (droppableId === 'doneList' || !isCreatedByMe) return false

    return true
  }

  const getAssignMeIconActive = () => {
    return false
  }

  const getUnassignMeIconActive = () => {
    return true
  }

  const getAssignMeIconTitle = () => {
    if (getUnassignMeIconActive()) return 'Unassign Me'

    return 'Assign Me'
  }

  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={preventDragging}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          // eslint-disable-next-line
          <li
            ref={provided.innerRef}
            className={cs(styles.mainContainer, {
              [styles.isDragging]: snapshot.isDragging,
              [styles.preventDragging]: preventDragging,
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseDown={(event: MouseEvent) => event.preventDefault()}
          >
            <DragIndicatorIcon className={styles.dragIcon} />
            <span className={styles.titleArea}>{title}</span>
            <span className={styles.dateArea}>{`Created: ${createdAt.substring(
              0,
              10
            )}`}</span>
            <span className={styles.creatorArea}>
              Created by:
              <span
                className={cs(styles.createdByTitle, {
                  [styles.createdByMe]: isCreatedByMe,
                })}
              >
                {isCreatedByMe ? 'ME' : creatorUser}
              </span>
            </span>
            <span className={styles.assignedArea}>
              Assigned to:
              <span
                className={cs(styles.assignedToTitle, {
                  [styles.assignedToMe]: isAssignedToMe,
                  [styles.assignedToMoreUsers]: assignedUsers.length > 0,
                })}
              >
                {getAssignedTo()}
                <LightTooltip title="Edit Users" placement="top">
                  <EditIcon
                    className={cs(styles.editUsersIcon, {
                      [styles.editUsersIconActive]: getIsEditUsersIconActive(),
                    })}
                  />
                </LightTooltip>
                <LightTooltip title="Unassign all Users" placement="top">
                  <DeleteOutlineIcon
                    className={cs(styles.deleteUsersIcon, {
                      [styles.deleteUsersIconActive]:
                        getIsDeleteUsersIconActive(),
                    })}
                  />
                </LightTooltip>
                <LightTooltip title={getAssignMeIconTitle()} placement="top">
                  <AssignmentIndIcon
                    className={cs(styles.assignMeIcon, {
                      [styles.assignMeIconActive]: getAssignMeIconActive(),
                      [styles.unassignMeIconActive]: getUnassignMeIconActive(),
                    })}
                  />
                </LightTooltip>
              </span>
            </span>
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
      }}
    </Draggable>
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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'steelblue',
    color: 'white',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))

export default TaskTile
