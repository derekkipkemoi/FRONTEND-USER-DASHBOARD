'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { paths } from '@/paths';
import { orderClient } from '@/lib/order/client';

const allowedTypes = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
];

const ResumeUploads = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const orderId = localStorage.getItem('orderId');
  const handleFileUpload = async (file: File) => {
    if (allowedTypes.includes(file.type)) {
      setResumeName(file.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('description', 'User resume file');
      if (orderId) {
        setIsPending(true);
        await orderClient.updateResumeFile(orderId, formData);
        setIsPending(false);
        setUploadComplete(true);
      }
    } else {
      alert('Invalid file type. Please upload a DOC, DOCX, PDF, HTML, RTF, or TXT file.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Stack>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Upload your CV (Drag & drop or browse)
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Choose your already existing CV document from your device
      </Typography>
      <Divider sx={{ height: '5px', borderColor: 'primary.main' }} />
      {isPending ? <LinearProgress sx={{ width: '100%' }} /> : null}
      <Box>
        <Card
          sx={{
            height: '200px',
            boxShadow: 3,
            textAlign: 'center',
            marginTop: 1,
            transition: 'box-shadow 0.3s, transform 0.3s',
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': {
              boxShadow: 6,
              transform: 'scale(1.02)',
            },
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} onClick={handleButtonClick}>
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
              }}
            >
              <Box sx={{ marginBottom: 2 }}>
                <img src="/assets/file.png" alt="Upload Icon" style={{ width: '64px', height: '64px' }} />
              </Box>
              {resumeName !== null ? (
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  <CheckCircleIcon sx={{ verticalAlign: 'middle', color: 'green', mr: 1 }} />
                  {resumeName}
                </Typography>
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  Drag and drop a file here
                </Typography>
              )}
              <Button
                onClick={handleButtonClick}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 20,
                  padding: '1px 50px',
                  fontSize: '1rem',
                  textTransform: 'none',
                }}
              >
                Browse
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".doc,.docx,.pdf,.html,.rtf,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </CardContent>
          </CardActionArea>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '15px' }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: '25px',
              backgroundColor: 'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
            onClick={() => {
              setIsPending(true);
              router.push(paths.resume.resumeOptions);
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              setIsPending(true);
              router.push(paths.resume.resumeSections);
            }}
            disabled={!uploadComplete}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'warning.main',
              color: 'black',
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: 'warning.dark',
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default ResumeUploads;
