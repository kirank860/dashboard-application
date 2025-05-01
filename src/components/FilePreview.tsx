import { Box, IconButton, Typography, Paper } from '@mui/material';
import { Close as CloseIcon, InsertDriveFile as FileIcon, Image as ImageIcon } from '@mui/icons-material';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const isImage = file.type.startsWith('image/');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: 300,
      }}
    >
      {isImage ? (
        <Box
          component="img"
          src={URL.createObjectURL(file)}
          alt={file.name}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            objectFit: 'cover',
          }}
        />
      ) : (
        <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </Typography>
      </Box>
      <IconButton size="small" onClick={onRemove}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default FilePreview; 