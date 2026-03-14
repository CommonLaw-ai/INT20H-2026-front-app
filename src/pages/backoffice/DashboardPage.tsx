import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { getChats, getTickets, getActionRequests, getUsers } from '@/api/backoffice.api';
import type { ChatListItem } from '@/types/api';
import type { Ticket, ActionRequest, User } from '@/types/entities';

type SortField = 'chat_id' | 'user_name' | 'priority' | 'status' | 'first_message' | 'issue_type';
type SortDirection = 'asc' | 'desc';

const STATUS_LABELS: Record<string, string> = {
  open_support: 'Open — Support',
  open_ai_agent: 'Open — AI Agent',
  closed_support: 'Closed — Support',
  closed_ai_agent: 'Closed — AI Agent',
};

const STATUS_COLORS: Record<string, 'warning' | 'info' | 'default' | 'success'> = {
  open_support: 'warning',
  open_ai_agent: 'info',
  closed_support: 'default',
  closed_ai_agent: 'success',
};

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Critical',
};

const PRIORITY_COLORS: Record<number, 'default' | 'info' | 'warning' | 'error'> = {
  1: 'default',
  2: 'info',
  3: 'warning',
  4: 'error',
};

/** Extract issue type from report data */
const getIssueType = (item: ChatListItem): string => {
  if (!item.report?.report_data) return '—';
  const data = item.report.report_data;
  if (typeof data === 'object' && 'issue_type' in data && typeof data.issue_type === 'string') {
    return data.issue_type;
  }
  return '—';
};

/** Get user display name */
const getUserName = (item: ChatListItem): string => {
  if (!item.user) return '—';
  const fullName = `${item.user.first_name} ${item.user.last_name}`.trim();
  return fullName || item.user.username || '—';
};

/** Format a date string as relative time (e.g. "3 days ago") */
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
};

const SKELETON_ROWS = 5;
const COLUMN_COUNT = 6;

/** Dashboard page — full viewport, no page scroll, internal sections scroll */
const DashboardPage = () => {
  const navigate = useNavigate();

  // Chats
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('open_support');
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Bottom panels
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [actionRequests, setActionRequests] = useState<ActionRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingPanels, setIsLoadingPanels] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoadingChats(true);
    setIsLoadingPanels(true);
    setError(null);
    try {
      const [chatsRes, ticketsRes, actionReqRes, usersRes] = await Promise.all([
        getChats(),
        getTickets(),
        getActionRequests(),
        getUsers(),
      ]);
      setChats(chatsRes.data);
      setTickets(ticketsRes.data);
      setActionRequests(actionReqRes.data);
      setUsers(usersRes.data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load dashboard data');
    } finally {
      setIsLoadingChats(false);
      setIsLoadingPanels(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortValue = (item: ChatListItem, field: SortField): string | number => {
    switch (field) {
      case 'chat_id': return item.chat.chat_id;
      case 'user_name': return getUserName(item).toLowerCase();
      case 'priority': return item.chat.priority_level_id;
      case 'status': return item.status;
      case 'first_message': return item.first_message.toLowerCase();
      case 'issue_type': return getIssueType(item).toLowerCase();
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = chats;

    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const userName = getUserName(item).toLowerCase();
        const firstMessage = item.first_message.toLowerCase();
        const issueType = getIssueType(item).toLowerCase();
        const chatId = String(item.chat.chat_id);
        return userName.includes(query) || firstMessage.includes(query) || issueType.includes(query) || chatId.includes(query);
      });
    }

    return [...result].sort((itemA, itemB) => {
      const valueA = getSortValue(itemA, sortField);
      const valueB = getSortValue(itemB, sortField);
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [chats, statusFilter, searchQuery, sortField, sortDirection]);

  /** Find the latest chat for a user and return relative time */
  const getLastRequest = (user: User): string => {
    const userChats = chats
      .filter((item) => item.chat.user_id === user.user_id)
      .sort((chatA, chatB) => new Date(chatB.chat.updated_at).getTime() - new Date(chatA.chat.updated_at).getTime());

    if (userChats.length === 0) return '—';
    return formatTimeAgo(userChats[0].chat.updated_at);
  };

  /** Find the action name by action_id */
  const getActionName = (actionId: number): string => {
    // We don't have actions loaded here, so just show the ID
    return `Action #${actionId}`;
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDirection : 'asc'}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 2 }}>
      {/* Header row */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ flexShrink: 0 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 300 }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          sx={{ width: 220 }}
        >
          <MenuItem value="">All statuses</MenuItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Chats table — takes remaining space, scrolls internally */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ flex: 1, minHeight: 0, border: '1px solid', borderColor: 'divider', overflow: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('chat_id', 'ID')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('user_name', 'User')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('priority', 'Priority')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('status', 'Status')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('first_message', 'First Message')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{renderSortableHeader('issue_type', 'Issue Type')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingChats &&
              Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {Array.from({ length: COLUMN_COUNT }).map((_, colIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                      <Skeleton variant="text" width={colIndex === 4 ? '80%' : '60%'} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoadingChats &&
              filteredAndSorted.map((item) => (
                <TableRow
                  key={item.chat.chat_id}
                  hover
                  sx={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                  onClick={() => navigate(`/bo/chat/${item.chat.chat_id}`)}
                >
                  <TableCell>#{item.chat.chat_id}</TableCell>
                  <TableCell>{getUserName(item)}</TableCell>
                  <TableCell>
                    <Chip
                      label={PRIORITY_LABELS[item.chat.priority_level_id] ?? `P${item.chat.priority_level_id}`}
                      size="small"
                      color={PRIORITY_COLORS[item.chat.priority_level_id] ?? 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[item.status] ?? item.status}
                      size="small"
                      color={STATUS_COLORS[item.status] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.first_message}
                  </TableCell>
                  <TableCell>{getIssueType(item)}</TableCell>
                </TableRow>
              ))}

            {!isLoadingChats && filteredAndSorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {chats.length === 0 ? 'No chats found' : 'No chats match the current filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bottom panels — fixed height, internally scrollable */}
      <Box sx={{ display: 'flex', gap: 2, flexShrink: 0, height: 220, minHeight: 220 }}>
        {/* Tickets */}
        <Paper
          elevation={0}
          sx={{ flex: 1, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
            Tickets
          </Typography>
          <List dense sx={{ overflow: 'auto', flex: 1 }}>
            {isLoadingPanels &&
              Array.from({ length: 3 }).map((_, index) => (
                <ListItem key={`ticket-skeleton-${index}`}>
                  <ListItemText primary={<Skeleton width="70%" />} secondary={<Skeleton width="40%" />} />
                </ListItem>
              ))}
            {!isLoadingPanels && tickets.length === 0 && (
              <ListItem>
                <ListItemText primary="No tickets" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
            {!isLoadingPanels &&
              tickets.map((ticket) => (
                <ListItem key={ticket.id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText
                    primary={ticket.ticket_name}
                    secondary={`#${ticket.id}`}
                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 }, secondary: { variant: 'caption' } }}
                  />
                </ListItem>
              ))}
          </List>
        </Paper>

        {/* Action Requests */}
        <Paper
          elevation={0}
          sx={{ flex: 1, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
            Action Requests
          </Typography>
          <List dense sx={{ overflow: 'auto', flex: 1 }}>
            {isLoadingPanels &&
              Array.from({ length: 3 }).map((_, index) => (
                <ListItem key={`ar-skeleton-${index}`}>
                  <ListItemText primary={<Skeleton width="70%" />} secondary={<Skeleton width="40%" />} />
                </ListItem>
              ))}
            {!isLoadingPanels && actionRequests.length === 0 && (
              <ListItem>
                <ListItemText primary="No action requests" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
            {!isLoadingPanels &&
              actionRequests.map((request) => (
                <ListItem
                  key={request.id}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => navigate(`/bo/chat/${request.chat_id}`)}
                >
                  <ListItemText
                    primary={getActionName(request.action_id)}
                    secondary={`Chat #${request.chat_id}`}
                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 }, secondary: { variant: 'caption' } }}
                  />
                  <Chip
                    label={request.is_approved ? 'Approved' : 'Pending'}
                    size="small"
                    color={request.is_approved ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </ListItem>
              ))}
          </List>
        </Paper>

        {/* Users */}
        <Paper
          elevation={0}
          sx={{ flex: 1, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
            Users
          </Typography>
          <List dense sx={{ overflow: 'auto', flex: 1 }}>
            {isLoadingPanels &&
              Array.from({ length: 3 }).map((_, index) => (
                <ListItem key={`user-skeleton-${index}`}>
                  <ListItemText primary={<Skeleton width="70%" />} secondary={<Skeleton width="40%" />} />
                </ListItem>
              ))}
            {!isLoadingPanels && users.length === 0 && (
              <ListItem>
                <ListItemText primary="No users" sx={{ color: 'text.secondary' }} />
              </ListItem>
            )}
            {!isLoadingPanels &&
              users.map((user) => (
                <ListItem key={user.user_id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`.trim() || user.username}
                    secondary={`#${user.user_id}`}
                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 }, secondary: { variant: 'caption' } }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                    {getLastRequest(user)}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
