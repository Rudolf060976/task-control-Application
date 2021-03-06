import React, { useEffect, useState } from 'react'
import { Task, User } from 'types/graphql'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
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
  onDeleteTask: (taskId: number) => void
  onAssignTaskToMe: (taskId: number, currentUsers: User[]) => void
  onUnassignMe: (taskId: number) => void
  onUnassignTask: (taskId: number) => void
  onAssignTask: (taskId: number, currentUsers: User[]) => void
  refreshTasks: boolean
}

const TaskTile: React.FC<TaskTileProps> = ({
  task,
  index,
  userList,
  userId,
  droppableId,
  onDeleteTask,
  onAssignTaskToMe,
  onUnassignMe,
  onUnassignTask,
  onAssignTask,
  refreshTasks,
}) => {
  const [assignedUsers, setAssignedUsers] = useState<User[]>([])

  const apolloClient = useApolloClient()

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAssignedUsersByTask(task.id, apolloClient)

      setAssignedUsers(users)
    }

    fetchData()
  }, [refreshTasks])

  const {
    title,
    createdAt,
    description,
    createdById,
    isCompleted,
    completedById,
  } = task

  const creatorUser =
    userList.find((user) => user.id === createdById)?.email || ''

  const isCreatedByMe = createdById === userId

  const isAssignedToMe = assignedUsers.some((user) => user.id === userId)

  const getAssignedTo = () => {
    if (isAssignedToMe) {
      if (assignedUsers.length === 1) return 'ME'

      return `ME and ${assignedUsers.length - 1} User(s)`
    }

    if (assignedUsers.length > 0) return `${assignedUsers.length} User(s)`

    return ''
  }

  const getIsEditUsersIconActive = () => {
    if (droppableId === 'doneList' || !isCreatedByMe) return false

    return true
  }

  const getIsDeleteUsersIconActive = () => {
    if (
      droppableId === 'doneList' ||
      !isCreatedByMe ||
      assignedUsers.length === 0
    )
      return false

    if (droppableId === 'inprogressList') return false

    return true
  }

  const getAssignMeIconActive = () => {
    if (!isCreatedByMe || isAssignedToMe) return false

    if (droppableId === 'doneList') return false

    return true
  }

  const getUnassignMeIconActive = () => {
    if (!isCreatedByMe || !isAssignedToMe) return false

    if (droppableId === 'inprogressList' && assignedUsers.length === 1)
      return false

    if (droppableId === 'doneList') return false

    return true
  }

  const getAssignMeIconTitle = () => {
    if (getUnassignMeIconActive()) return 'Unassign Me'

    return 'Assign Me'
  }

  const getPreventDragging = () => {
    if (
      droppableId === 'todoList' &&
      assignedUsers.length > 0 &&
      !isAssignedToMe &&
      !isCreatedByMe
    )
      return true

    if (
      (droppableId === 'inprogressList' || droppableId === 'doneList') &&
      !isCreatedByMe &&
      !isAssignedToMe
    )
      return true

    return false
  }

  const getIsDisableAssignedToTooltipHover = () => {
    if (isAssignedToMe && assignedUsers.length === 1) return true

    if (!isAssignedToMe && assignedUsers.length === 0) return true

    return false
  }

  const getDeleteTaskIconActive = () => {
    if (droppableId !== 'todoList' || !isCreatedByMe) return false
    return true
  }

  const handleAssignToMeIconClick = (taskId: number) => {
    if (getAssignMeIconActive()) onAssignTaskToMe(taskId, assignedUsers)

    if (getUnassignMeIconActive()) onUnassignMe(taskId)

    return
  }

  const getCompletedBy = () => {
    if (!isCompleted) return ''

    const completedUser = userList.find((user) => user.id === completedById)

    if (!completedUser) return ''

    return completedUser.email
  }

  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={getPreventDragging()}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          // eslint-disable-next-line
          <li
            ref={provided.innerRef}
            className={cs(styles.mainContainer, {
              [styles.isDragging]: snapshot.isDragging,
              [styles.preventDragging]: getPreventDragging(),
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
            <HtmlTooltip
              disableHoverListener={getIsDisableAssignedToTooltipHover()}
              title={
                <>
                  <Typography fontSize={12} color="inherit">
                    Assigned to Users:
                  </Typography>
                  <ul className={styles.userListTooltipList}>
                    {assignedUsers.map((user) => {
                      return <li key={user.id}>{user.email}</li>
                    })}
                  </ul>
                </>
              }
            >
              <span className={styles.assignedArea}>
                Assigned to:
                <span
                  className={cs(styles.assignedToTitle, {
                    [styles.assignedToMe]: isAssignedToMe,
                    [styles.assignedToMoreUsers]:
                      (assignedUsers.length === 1 && !isAssignedToMe) ||
                      assignedUsers.length > 1,
                  })}
                >
                  {getAssignedTo()}
                </span>
              </span>
            </HtmlTooltip>

            <span className={styles.descripArea}>
              {`Description:`}
              <HtmlTooltip
                title={
                  <>
                    <Typography fontSize={12} color="inherit">
                      Description:
                    </Typography>
                    <p>{description}</p>
                  </>
                }
              >
                <VisibilityIcon className={styles.descriptionIcon} />
              </HtmlTooltip>
            </span>
            <span className={styles.doneArea}>
              <span
                className={cs(styles.doneContainer, {
                  [styles.taskNotCompleted]: !isCompleted,
                })}
              >
                <span className={styles.doneByTitle}>
                  {isCompleted ? 'Completed By:' : ''}
                </span>
                <span className={styles.doneByUsername}>
                  {getCompletedBy()}
                </span>
              </span>
            </span>
            <span className={styles.buttonsArea}>
              <LightTooltip title="Assign Users" placement="top">
                <EditIcon
                  className={cs(styles.editUsersIcon, {
                    [styles.editUsersIconActive]: getIsEditUsersIconActive(),
                  })}
                  onClick={() =>
                    getIsEditUsersIconActive()
                      ? onAssignTask(task.id, assignedUsers)
                      : null
                  }
                />
              </LightTooltip>
              <LightTooltip title="Unassign all Users" placement="top">
                <CancelPresentationIcon
                  className={cs(styles.deleteUsersIcon, {
                    [styles.deleteUsersIconActive]:
                      getIsDeleteUsersIconActive(),
                  })}
                  onClick={() =>
                    getIsDeleteUsersIconActive()
                      ? onUnassignTask(task.id)
                      : null
                  }
                />
              </LightTooltip>
              <LightTooltip title={getAssignMeIconTitle()} placement="top">
                <AssignmentIndIcon
                  className={cs(styles.assignMeIcon, {
                    [styles.assignMeIconActive]: getAssignMeIconActive(),
                    [styles.unassignMeIconActive]: getUnassignMeIconActive(),
                  })}
                  onClick={() => handleAssignToMeIconClick(task.id)}
                />
              </LightTooltip>
            </span>
            <span className={styles.buttons2Area}>
              <LightTooltip title="Delete Task" placement="top">
                <DeleteOutlineIcon
                  className={cs(styles.deleteTaskIcon, {
                    [styles.deleteTaskIconActive]: getDeleteTaskIconActive(),
                  })}
                  onClick={() =>
                    getDeleteTaskIconActive() ? onDeleteTask(task.id) : null
                  }
                />
              </LightTooltip>
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
