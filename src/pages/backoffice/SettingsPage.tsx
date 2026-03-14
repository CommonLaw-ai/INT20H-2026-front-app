import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddRounded from '@mui/icons-material/AddRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { getActions, createAction, updateAction } from '@/api/backoffice.api';
import type { Action } from '@/types/entities';

interface ActionFormState {
  action_name: string;
  action_description: string;
  is_allowed: boolean;
}

const EMPTY_FORM: ActionFormState = {
  action_name: '',
  action_description: '',
  is_allowed: true,
};

/** Settings page for managing actions (CRUD) */
const SettingsPage = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [form, setForm] = useState<ActionFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const fetchActions = async () => {
    try {
      const response = await getActions();
      setActions(response.data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load actions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleOpenCreate = () => {
    setEditingAction(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const handleOpenEdit = (action: Action) => {
    setEditingAction(action);
    setForm({
      action_name: action.action_name,
      action_description: action.action_description,
      is_allowed: action.is_allowed,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAction(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingAction) {
        await updateAction({
          action_id: editingAction.action_id,
          ...form,
        });
      } else {
        await createAction(form);
      }
      handleClose();
      await fetchActions();
    } catch {
      setError('Failed to save action');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Settings — Actions
        </Typography>
        <Button variant="contained" startIcon={<AddRounded />} onClick={handleOpenCreate}>
          Add Action
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Allowed</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action.action_id}>
                <TableCell>{action.action_name}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {action.action_description}
                </TableCell>
                <TableCell>
                  <Switch checked={action.is_allowed} disabled size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEdit(action)}>
                    <EditRounded fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {actions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No actions configured</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAction ? 'Edit Action' : 'Add Action'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Action Name"
            value={form.action_name}
            onChange={(event) => setForm((prev) => ({ ...prev, action_name: event.target.value }))}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={form.action_description}
            onChange={(event) => setForm((prev) => ({ ...prev, action_description: event.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.is_allowed}
                onChange={(event) => setForm((prev) => ({ ...prev, is_allowed: event.target.checked }))}
              />
            }
            label="Allowed"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !form.action_name.trim()}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsPage;
