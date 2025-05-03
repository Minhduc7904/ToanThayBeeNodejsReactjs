import React from 'react';
import { useDispatch } from 'react-redux';
import { testTokenSource } from '../features/auth/authSlice';
import { Button, Typography, Box, Paper } from '@mui/material';

const TokenTest = () => {
    const dispatch = useDispatch();

    const handleTestToken = async () => {
        try {
            await dispatch(testTokenSource()).unwrap();
        } catch (error) {
            console.error('Error testing token:', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Kiểm tra Token
            </Typography>
            <Typography variant="body1" paragraph>
                Nhấn nút bên dưới để kiểm tra xem token đang được gửi qua cookie hay header.
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleTestToken}
                >
                    Kiểm tra Token
                </Button>
            </Box>
        </Paper>
    );
};

export default TokenTest;
