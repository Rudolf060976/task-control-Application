import React from 'react'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'

type ConfirmationModalProps = {
  isOpen: boolean
  message: string
  onClose: () => void
  onConfirm: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationModal
