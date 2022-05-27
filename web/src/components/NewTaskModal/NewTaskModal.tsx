import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

type NewTaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (title: string, description: string) => void
}

type ModalType = { title: string; description: string }

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [values, setValues] = useState<ModalType>({
    title: '',
    description: '',
  })

  useEffect(() => {
    if (isOpen) setValues({ title: '', description: '' })
  }, [isOpen])

  const titleMaxChars = 50

  const descriptionMaxChars = 300

  const changeHandler = (name: 'title' | 'description', value: string) => {
    if (name === 'title') {
      if (value.length > titleMaxChars) return
    }

    if (name === 'description') {
      if (value.length > descriptionMaxChars) return
    }

    const newValues = {
      ...values,
      [name]: value,
    }

    setValues(newValues)
  }

  const confirmHandler = () => {
    if (!values.title || !values.description) return

    const { title, description } = values

    onConfirm(title, description)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          name="title"
          margin="dense"
          id="title"
          label={`Title - ${titleMaxChars - values.title.length} chars left`}
          type="text"
          fullWidth
          variant="standard"
          value={values.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            changeHandler('title', event.target.value)
          }
        />
        <TextField
          name="description"
          margin="dense"
          id="description"
          label={`Description (up to 5 lines) - ${
            descriptionMaxChars - values.description.length
          } chars left`}
          type="text"
          fullWidth
          variant="standard"
          value={values.description}
          multiline
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            changeHandler('description', event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={confirmHandler}
          disabled={!values.title || !values.description}
        >
          Confirm
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewTaskModal
