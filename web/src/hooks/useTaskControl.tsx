import { useState, useEffect } from 'react'
import { DropResult, DragStart } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import {
  DroppableId,
  TaskFilter,
  TaskStatus,
} from 'src/components/TasksControlPanel/TasksControlPanel'
import {
  assignTask,
  createTask,
  deleteAllTasks,
  getAllUsers,
  getAllTasksByStatus,
  getUserTasksByStatus,
  updateTaskPositions,
  changeTaskStatus,
  unassignTask,
  getAssignedUsersByTask,
  deleteTask,
  unassignTaskByUser,
  archiveTasks,
} from 'src/graphql/task/services'
import { Task, User } from 'types/graphql'
import { filterOtherUsersTasks, updateUserTaskPositions } from 'src/utils/tasks'

type ListType = 'todo' | 'inprogress' | 'done'

type DataOnProcess = {
  taskId: number
  allUsers: User[]
  currentUsers: User[]
  confirmMessage: string
  operationType:
    | 'deleteTask'
    | 'unassignedTaskToMe'
    | 'unnasignedTask'
    | 'assignTask'
    | 'archiveTask'
}

export const useTaskControl = (userId: number) => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('mine')

  const [todoTaskList, setTodoTaskList] = useState<Task[]>([])
  const [inprogressTaskList, setInprogressTaskList] = useState<Task[]>([])
  const [doneTaskList, setDoneTaskList] = useState<Task[]>([])

  const [refreshTasks, setRefreshTasks] = useState(false)

  const [userList, setUserList] = useState<User[]>([])

  const [currentSourceDragDroppable, setCurrentSourceDragDroppable] =
    useState<DroppableId | null>(null)

  const [dataOnProcess, setDataOnProcess] = useState<DataOnProcess | null>(null)

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const [isAssignUsersModalOpen, setIsAssignUsersModalOpen] = useState(false)

  const apolloClient = useApolloClient()

  useEffect(() => {
    fetchTaskData()
  }, [])

  useEffect(() => {
    fetchTaskData()
  }, [taskFilter])

  useEffect(() => {
    if (refreshTasks) {
      fetchTaskData()
    }
  }, [refreshTasks])

  useEffect(() => {
    if (!dataOnProcess) return

    if (dataOnProcess.operationType !== 'assignTask') {
      setIsConfirmModalOpen(true)
      return
    }

    setIsAssignUsersModalOpen(true)
    return
  }, [dataOnProcess])

  useEffect(() => {
    if (!isConfirmModalOpen) {
      setDataOnProcess(null)
    }
  }, [isConfirmModalOpen])

  useEffect(() => {
    if (!isAssignUsersModalOpen) {
      setDataOnProcess(null)
    }
  }, [isAssignUsersModalOpen])

  const fetchTaskData = async () => {
    const allUsers = await getAllUsers(apolloClient)

    if (taskFilter === 'mine') {
      const sortedTodoTasks = (await updateTaskLists(
        taskFilter,
        'todo'
      )) as Task[]

      const sortedInprogressTasks = (await updateTaskLists(
        taskFilter,
        'inprogress'
      )) as Task[]

      const sortedDoneTasks = (await updateTaskLists(
        taskFilter,
        'done'
      )) as Task[]

      setUserList(allUsers)

      setTodoTaskList(sortedTodoTasks)

      setInprogressTaskList(sortedInprogressTasks)

      setDoneTaskList(sortedDoneTasks)

      return setRefreshTasks(false)
    }

    const {
      sortedUserTasks: sortedUserTodoTasks,
      otherUsersTasks: otherUsersTodoTasks,
    } = (await updateTaskLists('all', 'todo')) as {
      sortedUserTasks: Task[]
      otherUsersTasks: Task[]
    }

    const {
      sortedUserTasks: sortedUserInprogressTasks,
      otherUsersTasks: otherUsersInprogressTasks,
    } = (await updateTaskLists('all', 'inprogress')) as {
      sortedUserTasks: Task[]
      otherUsersTasks: Task[]
    }

    const {
      sortedUserTasks: sortedUserDoneTasks,
      otherUsersTasks: otherUsersDoneTasks,
    } = (await updateTaskLists('all', 'done')) as {
      sortedUserTasks: Task[]
      otherUsersTasks: Task[]
    }

    setUserList(allUsers)

    setTodoTaskList([...sortedUserTodoTasks, ...otherUsersTodoTasks])

    setInprogressTaskList([
      ...sortedUserInprogressTasks,
      ...otherUsersInprogressTasks,
    ])

    setDoneTaskList([...sortedUserDoneTasks, ...otherUsersDoneTasks])

    setRefreshTasks(false)
  }

  const updateTaskLists = async (
    taskFilter: TaskFilter,
    taskStatus: TaskStatus
  ) => {
    if (taskFilter === 'mine') {
      const userTasks = await getUserTasksByStatus(
        userId,
        taskStatus,
        apolloClient
      )

      const sortedTasks = [...userTasks].sort(
        (taskA: Task, taskB: Task) => taskA.position - taskB.position
      )

      return sortedTasks
    }

    const allTasks = await getAllTasksByStatus(taskStatus, apolloClient)

    const userTasks = await getUserTasksByStatus(
      userId,
      taskStatus,
      apolloClient
    )

    const otherUsersTasks = filterOtherUsersTasks(allTasks, userTasks)

    const sortedUserTasks = [...userTasks].sort(
      (taskA: Task, taskB: Task) => taskA.position - taskB.position
    )

    return { sortedUserTasks, otherUsersTasks }
  }

  const addTaskToList = (listType: ListType, task: Task) => {
    if (listType === 'todo') {
      return setTodoTaskList([...todoTaskList, task])
    }
    if (listType === 'inprogress') {
      return setInprogressTaskList([...inprogressTaskList, task])
    }
    if (listType === 'done') {
      return setDoneTaskList([...doneTaskList, task])
    }
  }

  const dragStartHandler = (initial: DragStart) => {
    const droppableId = initial.source.droppableId

    setCurrentSourceDragDroppable(droppableId)
  }

  const dragEndHandler = (result: DropResult) => {
    const { destination, source, draggableId } = result

    setCurrentSourceDragDroppable(null)

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (source.droppableId === destination.droppableId) {
      handleDraggingOnTheSameDroppable(
        source.droppableId,
        source.index,
        destination.index,
        draggableId
      )
      return
    }

    if (source.droppableId !== destination.droppableId) {
      handleDraggingFromOneDroppableToAnother(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      )
    }
  }

  const handleDraggingOnTheSameDroppable = async (
    droppableId: DroppableId,
    sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ): Promise<void> => {
    let taskList
    let setTaskList
    let destinationStatus: TaskStatus

    switch (droppableId) {
      case 'todoList':
        taskList = [...todoTaskList]
        setTaskList = setTodoTaskList
        destinationStatus = 'todo'
        break

      case 'inprogressList':
        taskList = [...inprogressTaskList]
        setTaskList = setInprogressTaskList
        destinationStatus = 'inprogress'
        break

      case 'doneList':
        taskList = [...doneTaskList]
        setTaskList = setDoneTaskList
        destinationStatus = 'done'
        break

      default:
        return
    }

    const draggedTask = taskList.find(
      (task) => task.id.toString() === draggableId
    )

    if (!draggedTask) return

    taskList.splice(sourceIndex, 1)

    taskList.splice(destinationIndex, 0, draggedTask)

    setTaskList(taskList)

    const userTasks = await getUserTasksByStatus(
      userId,
      destinationStatus,
      apolloClient
    )

    const sortedTasks = updateUserTaskPositions(taskList, userTasks)

    const taskPositions = sortedTasks.map((task) => ({
      id: task.id,
      position: task.position,
    }))

    updateTaskPositions(taskPositions, apolloClient)
  }

  const handleDraggingFromOneDroppableToAnother = async (
    draggableId: string,
    sourceDroppableId: DroppableId,
    destinationDroppableId: DroppableId,
    destinationIndex: number
  ) => {
    let sourceTaskList
    let setSourceTaskList
    let destinationTaskList
    let setDestinationTaskList
    let sourceStatus: TaskStatus
    let destinationStatus: TaskStatus

    switch (sourceDroppableId) {
      case 'todoList':
        sourceTaskList = [...todoTaskList]
        setSourceTaskList = setTodoTaskList
        sourceStatus = 'todo'
        break

      case 'inprogressList':
        sourceTaskList = [...inprogressTaskList]
        setSourceTaskList = setInprogressTaskList
        sourceStatus = 'inprogress'
        break

      case 'doneList':
        sourceTaskList = [...doneTaskList]
        setSourceTaskList = setDoneTaskList
        sourceStatus = 'done'
        break

      default:
        return
    }

    switch (destinationDroppableId) {
      case 'todoList':
        destinationTaskList = [...todoTaskList]
        setDestinationTaskList = setTodoTaskList
        destinationStatus = 'todo'
        break

      case 'inprogressList':
        destinationTaskList = [...inprogressTaskList]
        setDestinationTaskList = setInprogressTaskList
        destinationStatus = 'inprogress'
        break

      case 'doneList':
        destinationTaskList = [...doneTaskList]
        setDestinationTaskList = setDoneTaskList
        destinationStatus = 'done'
        break

      default:
        return
    }
    const draggableTask = sourceTaskList.find(
      (task) => task.id.toString() === draggableId
    ) as Task

    const usersAssignedToTask = await getAssignedUsersByTask(
      draggableTask.id,
      apolloClient
    )

    const noUsersAssignedToTask = usersAssignedToTask.length === 0

    const destinationTask = {
      ...draggableTask,
      status: destinationStatus,
    }

    const filteredSourceTaskList = [...sourceTaskList].filter(
      (task) => task.id.toString() !== draggableId
    )

    const newDestinationList = [...destinationTaskList].splice(
      destinationIndex,
      0,
      destinationTask
    )
    setSourceTaskList(filteredSourceTaskList)
    setDestinationTaskList(newDestinationList)

    const userTasks = await getUserTasksByStatus(
      userId,
      destinationStatus,
      apolloClient
    )

    const sortedUserTasks = updateUserTaskPositions(
      newDestinationList,
      userTasks,
      destinationTask
    )

    const taskPositions = sortedUserTasks.map((task) => ({
      id: task.id,
      position: task.position,
    }))

    if (sourceStatus === 'todo' && destinationStatus === 'inprogress') {
      if (noUsersAssignedToTask) {
        await assignTask([userId], destinationTask.id, apolloClient)
      }

      await changeTaskStatus(
        userId,
        destinationTask.id,
        'inprogress',
        apolloClient
      )
    }

    if (sourceStatus === 'done' && destinationStatus === 'inprogress') {
      await changeTaskStatus(
        userId,
        destinationTask.id,
        'inprogress',
        apolloClient
      )
    }

    if (destinationStatus === 'todo') {
      await changeTaskStatus(userId, destinationTask.id, 'todo', apolloClient)
    }

    if (destinationStatus === 'done') {
      await changeTaskStatus(userId, destinationTask.id, 'done', apolloClient)
    }

    await updateTaskPositions(taskPositions, apolloClient)

    setRefreshTasks(true)
  }

  const newTaskModalConfirmHandler = async (
    title: string,
    description: string
  ) => {
    const newTask = await createTask(userId, title, description, apolloClient)

    if (!newTask) return

    addTaskToList('todo', newTask)

    setSnackBarMessage('Your task was created successfully!')

    setRefreshTasks(true)

    setIsNewTaskModalOpen(false)
  }

  const isSnackBarOpen = !!snackBarMessage
  const snackBarCloseHandler = () => {
    setSnackBarMessage(null)
  }

  const handleTaskFilter = (filterValue: TaskFilter) => {
    setTaskFilter(filterValue)
  }

  const deleteAllTasksHandler = () => {
    deleteAllTasks(apolloClient)
    setRefreshTasks(true)
  }

  const isTodoListDropDisabled = currentSourceDragDroppable === 'doneList'

  const isDoneListDropDisabled = currentSourceDragDroppable === 'todoList'

  const deleteTaskHandler = (taskId: number) => {
    setDataOnProcess({
      taskId,
      currentUsers: [],
      allUsers: [],
      confirmMessage: 'Are you sure that you want to Delete this Task?',
      operationType: 'deleteTask',
    })
  }

  const assignTaskToMeHandler = async (
    taskId: number,
    currentUsers: User[]
  ) => {
    const currentUserIds = currentUsers.map((user) => user.id)

    await assignTask([...currentUserIds, userId], taskId, apolloClient)

    setRefreshTasks(true)
  }

  const unassignTaskToMeHandler = async (taskId: number) => {
    await unassignTaskByUser(taskId, userId, apolloClient)

    setRefreshTasks(true)
  }

  const unassignTaskHandler = async (taskId: number) => {
    await unassignTask(taskId, apolloClient)

    setRefreshTasks(true)
  }

  const assignTaskHandler = async (taskId: number, currentUsers: User[]) => {
    const allUsers = await getAllUsers(apolloClient)

    setDataOnProcess({
      taskId,
      allUsers,
      currentUsers,
      confirmMessage: '',
      operationType: 'assignTask',
    })
  }

  const confirmationModalConfirmHandler = async () => {
    const { operationType, taskId, users } = dataOnProcess

    setIsConfirmModalOpen(false)

    if (operationType === 'deleteTask') {
      await deleteTask(userId, taskId, apolloClient)
      return setRefreshTasks(true)
    }
    if (operationType === 'archiveTask') {
      const userTasks = await getUserTasksByStatus(userId, 'done', apolloClient)

      const userTaskIds = userTasks.map((userTask) => userTask.id)

      await archiveTasks(userTaskIds, apolloClient)

      const taskCounter = userTaskIds.length

      if (taskCounter === 1) {
        setSnackBarMessage(`1 Task has been Archived successfully!`)
      } else {
        setSnackBarMessage(
          `${taskCounter} Tasks have been Archived successfully!`
        )
      }

      setRefreshTasks(true)
    }
  }

  const handleArchiveTasks = async () => {
    const userTasks = await getUserTasksByStatus(userId, 'done', apolloClient)

    if (userTasks.length === 0) {
      setSnackBarMessage('The are no Tasks to be Archived!')

      return
    }

    setDataOnProcess({
      taskId: 0,
      allUsers: [],
      currentUsers: [],
      confirmMessage:
        'Are you sure that you want to Archive your own Done Tasks?',
      operationType: 'archiveTask',
    })
  }

  const assignUsersModalConfirmHandler = async (users: User[]) => {
    const { taskId } = dataOnProcess
    console.log('***** USERS ****', JSON.stringify(users, null, 2))
    const newUserIds = users.map((user) => user.id)

    await assignTask([...newUserIds], taskId, apolloClient)

    setIsAssignUsersModalOpen(false)

    setRefreshTasks(true)
  }

  return {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    dragStartHandler,
    dragEndHandler,
    newTaskModalConfirmHandler,
    isSnackBarOpen,
    snackBarCloseHandler,
    snackBarMessage: snackBarMessage || '',
    handleTaskFilter,
    taskFilter,
    todoTaskList,
    inprogressTaskList,
    doneTaskList,
    deleteAllTasksHandler,
    userList,
    isTodoListDropDisabled,
    isDoneListDropDisabled,
    deleteTaskHandler,
    assignTaskToMeHandler,
    unassignTaskHandler,
    assignTaskHandler,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    dataOnProcess,
    confirmationModalConfirmHandler,
    unassignTaskToMeHandler,
    refreshTasks,
    handleArchiveTasks,
    isAssignUsersModalOpen,
    setIsAssignUsersModalOpen,
    assignUsersModalConfirmHandler,
  }
}
