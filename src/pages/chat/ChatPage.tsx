import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import ChatMessageList from '@/components/ChatMessageList';
import ChatInput from '@/components/ChatInput';
import FadeIn from '@/components/FadeIn';
import { getChat, sendMessage } from '@/api/chat.api';
import type { Chat } from '@/types/entities';

/** Chat conversation page — displays messages with send + refresh */
const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const chatId = Number(id);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getChat(chatId);
      setChat(response.data);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleSend = async (text: string) => {
    setIsSending(true);
    try {
      await sendMessage(chatId, { text });
      await fetchChat();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading && !chat) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        py: 4,
      }}
    >
      <FadeIn delay={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Chat #{chatId}
          </Typography>
          <IconButton
            onClick={fetchChat}
            disabled={isLoading}
            sx={{
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <RefreshRounded />
          </IconButton>
        </Box>
      </FadeIn>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <FadeIn delay={100}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            px: 3,
            py: 1,
            mb: 3,
            minHeight: 300,
          }}
        >
          <ChatMessageList messages={chat?.chat_messages ?? null} />
        </Box>
      </FadeIn>

      <FadeIn delay={200}>
        <ChatInput onSend={handleSend} disabled={isSending} placeholder="Type your reply..." />
      </FadeIn>
    </Container>
  );
};

export default ChatPage;
