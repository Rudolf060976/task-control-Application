import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

type TaskToggleButtonProps = {
  value: 'all' | 'mine'
  onChange: (value: 'all' | 'mine') => void
}

const TaskToggleButton: React.FC<TaskToggleButtonProps> = ({
  value,
  onChange,
}) => {
  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={(event: React.MouseEvent<HTMLElement>, value) =>
        onChange(value)
      }
    >
      <ToggleButton value="mine">Mine</ToggleButton>
      <ToggleButton value="all">All</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default TaskToggleButton
