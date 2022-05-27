import { useState, useEffect } from 'react'
import { DropResult, ResponderProvided, DragStart } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import { TaskFilter } from 'src/components/TasksControlPanel/TasksControlPanel'
import {
  assignTask,
  createTask,
  deleteAllTasks,
  getAllUsers,
  getAllTasksByStatus,
  getUserTasksByStatus,
  updateTaskPositions,
  changeTaskStatus,
} from 'src/graphql/task/services'
import { Task, User } from 'types/graphql'
import {
  filterOtherUsersTasks,
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
      const myTodoTasks = await getUserTasksByStatus(
        userId,
        'todo',
        apolloClient
      )

      const myInprogressTasks = await getUserTasksByStatus(
        userId,
        'inprogress',
        apolloClient
      )

      const sortedTodoTasks = [...myTodoTasks].sort(
        (taskA: Task, taskB: Task) => taskA.position - taskB.position
      )

      const sortedInprogressTasks = [...myInprogressTasks].sort(
        (taskA: Task, taskB: Task) => taskA.position - taskB.position
      )

      setUserList(allUsers)

      setTodoTaskList(sortedTodoTasks)

      setInprogressTaskList(sortedInprogressTasks)

      return setRefreshTasks(false)
    }

    const allTodoTasks = await getAllTasksByStatus('todo', apolloClient)

    const allInprogressTasks = await getAllTasksByStatus(
      'inprogress',
      apolloClient
    )

    const otherUsersTodoTasks = filterOtherUsersTasks(allTodoTasks, userId)

    const userTodoTasks = filterUserTasksAndUpdatePositions(
      allTodoTasks,
      userId
    )

    const otherUsersInprogressTasks = filterOtherUsersTasks(
      allInprogressTasks,
      userId
    )

    const userInprogressTasks = filterUserTasksAndUpdatePositions(
      allInprogressTasks,
      userId
    )

    setUserList(allUsers)

    setTodoTaskList([...userTodoTasks, ...otherUsersTodoTasks])

    setInprogressTaskList([
      ...userInprogressTasks,
      ...otherUsersInprogressTasks,
    ])

    setRefreshTasks(false)
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

  const dragStartHandler = (
    initial: DragStart,
    provided: ResponderProvided
  ) => {}

  const dragEndHandler = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (
      source.droppableId === 'todoList' &&
      destination.droppableId === 'todoList'
    ) {
      const todoTask = todoTaskList.find(
        (task) => task.id.toString() === draggableId
      )

      if (!todoTask) return

      const currentTodoList = [...todoTaskList]

      currentTodoList.splice(source.index, 1)

      currentTodoList.splice(destination.index, 0, todoTask)

      setTodoTaskList(currentTodoList)

      const userTodoTasks = filterUserTasksAndUpdatePositions(
        currentTodoList,
        userId
      )

      const taskPositions = userTodoTasks.map((task) => ({
        id: task.id,
        position: task.position,
      }))

      return updateTaskPositions(taskPositions, apolloClient)
    }

    if (
      source.droppableId === 'todoList' &&
      destination.droppableId === 'inprogressList'
    ) {
      const todoTask = todoTaskList.find(
        (task) => task.id.toString() === draggableId
      )

      const inprogressTask = {
        ...todoTask,
        status: 'inprogress',
        assignedToId: userId,
      }

      const filteredTodoTaskList = [...todoTaskList].filter(
        (task) => task.id.toString() !== draggableId
      )

      const newInProgressList = [...inprogressTaskList].splice(
        destination.index,
        0,
        inprogressTask
      )
      setTodoTaskList(filteredTodoTaskList)
      setInprogressTaskList(newInProgressList)

      const userInprogressTasks = filterUserTasksAndUpdatePositions(
        newInProgressList,
        userId
      )

      const taskPositions = userInprogressTasks.map((task) => ({
        id: task.id,
        position: task.position,
      }))

      const updateTask = async () => {
        await assignTask(userId, inprogressTask.id, apolloClient)

        await changeTaskStatus(
          userId,
          inprogressTask.id,
          'inprogress',
          apolloClient
        )

        await updateTaskPositions(taskPositions, apolloClient)

        setRefreshTasks(true)
      }

      updateTask()
    }
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
  }
}
