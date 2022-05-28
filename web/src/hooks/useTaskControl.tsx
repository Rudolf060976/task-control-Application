import { useState, useEffect } from 'react'
import { DropResult, ResponderProvided, DragStart } from 'react-beautiful-dnd'
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
} from 'src/graphql/task/services'
import { Task, User } from 'types/graphql'
import {
  filterOtherUsersTasks,
  filterUsersTasks,
  filterUserTasksAndUpdatePositions,
} from 'src/utils/tasks'

type ListType = 'todo' | 'inprogress' | 'done'

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

    const otherUsersTasks = filterOtherUsersTasks(allTasks, userId)

    const userTasks = filterUsersTasks(allTasks, userId)

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

  const handleDraggingOnTheSameDroppable = (
    droppableId: DroppableId,
    sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ): void => {
    let taskList
    let setTaskList

    switch (droppableId) {
      case 'todoList':
        taskList = [...todoTaskList]
        setTaskList = setTodoTaskList

        break

      case 'inprogressList':
        taskList = [...inprogressTaskList]
        setTaskList = setInprogressTaskList

        break

      case 'doneList':
        taskList = [...doneTaskList]
        setTaskList = setDoneTaskList

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

    const userTasks = filterUserTasksAndUpdatePositions(taskList, userId)

    const taskPositions = userTasks.map((task) => ({
      id: task.id,
      position: task.position,
    }))

    updateTaskPositions(taskPositions, apolloClient)
  }

  const handleDraggingFromOneDroppableToAnother = (
    draggableId: string,
    sourceDroppableId: DroppableId,
    destinationDroppableId: DroppableId,
    destinationIndex: number
  ) => {
    let sourceTaskList
    let setSourceTaskList
    let destinationTaskList
    let setDestinationTaskList
    let destinationStatus: TaskStatus

    switch (sourceDroppableId) {
      case 'todoList':
        sourceTaskList = [...todoTaskList]
        setSourceTaskList = setTodoTaskList
        break

      case 'inprogressList':
        sourceTaskList = [...inprogressTaskList]
        setSourceTaskList = setInprogressTaskList

        break

      case 'doneList':
        sourceTaskList = [...doneTaskList]
        setSourceTaskList = setDoneTaskList

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
    )

    const getAssignedToId = () => {
      if (destinationStatus === 'todo') return null
      if (destinationStatus === 'inprogress' || destinationStatus === 'done')
        return userId
    }

    const destinationTask = {
      ...draggableTask,
      status: destinationStatus,
      assignedToId: getAssignedToId,
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

    const userDestinationTasks = filterUserTasksAndUpdatePositions(
      newDestinationList,
      userId
    )

    const taskPositions = userDestinationTasks.map((task) => ({
      id: task.id,
      position: task.position,
    }))

    const updateTask = async () => {
      if (destinationStatus === 'inprogress') {
        await assignTask(userId, destinationTask.id, apolloClient)
        await changeTaskStatus(
          userId,
          destinationTask.id,
          'inprogress',
          apolloClient
        )
      }
      if (destinationStatus === 'todo') {
        await unassignTask(destinationTask.id, apolloClient)
        await changeTaskStatus(userId, destinationTask.id, 'todo', apolloClient)
      }

      if (destinationStatus === 'done') {
        await changeTaskStatus(userId, destinationTask.id, 'done', apolloClient)
      }

      await updateTaskPositions(taskPositions, apolloClient)

      setRefreshTasks(true)
    }

    updateTask()
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
  }
}
