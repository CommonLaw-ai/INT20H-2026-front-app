import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import SendRounded from '@mui/icons-material/SendRounded';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/** Messenger-style input with rounded corners, auto-grow, and embedded send button */
const ChatInput = ({ onSend, disabled = false, placeholder = 'Type your message...' }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        p: 1,
        pl: 2.5,
        pr: 1,
        borderRadius: '24px',
        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: `0 0 0 2px ${isDark ? 'rgba(201,160,122,0.15)' : 'rgba(179,132,90,0.15)'}`,
        },
      }}
    >
      <Box
        component="textarea"
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        sx={{
          flex: 1,
          border: 'none',
          outline: 'none',
          bgcolor: 'transparent',
          color: 'text.primary',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          resize: 'none',
          py: 0.8,
          '&::placeholder': {
            color: 'text.secondary',
            opacity: 0.6,
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={!canSend}
        size="small"
        sx={{
          bgcolor: canSend ? 'primary.main' : 'transparent',
          color: canSend ? 'primary.contrastText' : 'text.secondary',
          width: 36,
          height: 36,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: canSend ? 'primary.dark' : 'transparent',
          },
          '&.Mui-disabled': {
            color: 'text.secondary',
            opacity: 0.4,
          },
        }}
      >
        <SendRounded sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
