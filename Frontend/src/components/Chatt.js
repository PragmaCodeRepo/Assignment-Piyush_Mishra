import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Container, Paper, List, ListItem, Card, CardContent, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import api from './Api';
import ChatDataVisualization from './chatDataVisualization';
import './Chatt.css';

const Chat = ({ onLogout, username }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [refresh, setRefresh] = useState(false); // State variable to trigger refresh

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get('/chat-history/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
                });
                setMessages(response.data);
            } catch (error) {
                console.error("There was an error fetching the chat messages!", error);
            }
        };

        fetchMessages();
    }, [refresh]); // Add refresh as a dependency

    const handleSendMessage = async () => {
        try {
            const response = await api.post('/chat-with-gpt/', { message: newMessage }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
            });
            const chatMessage = {
                user: { username },
                message: newMessage,
                response: response.data.response,
                timestamp: new Date().toISOString()
            };
            setMessages([chatMessage, ...messages]);
            setNewMessage('');
            setRefresh(!refresh); // Toggle refresh state to trigger re-fetch
        } catch (error) {
            console.error("There was an error sending the message!", error);
            setError("Failed to send message: " + (error.response?.data?.error || error.message));
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout/', {
                refresh: localStorage.getItem('refresh')
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
            });
            onLogout();
        } catch (error) {
            console.error("There was an error logging out!", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Chat Application
                    </Typography>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Welcome, {username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ flexGrow: 1, mt: 2, display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ flexGrow: 1, p: 2, overflow: 'auto', minHeight: '400px' }}>
                    {messages.length > 0 ? (
                        <List>
                            {messages.map((msg, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <Card sx={{ width: '100%', mb: 1, backgroundColor: msg.user && msg.user.username === username ? '#e3f2fd' : '#f1f8e9' }}>
                                        <CardContent>
                                            <Typography variant="body1" color="textPrimary">
                                                <strong>You</strong> {msg.message}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>AI:</strong> {msg.response}
                                                </Typography>
                                                <CopyToClipboard text={msg.response} onCopy={() => setCopySuccess('Copied!')}>
                                                    <IconButton size="small" color="primary">
                                                        <ContentCopyIcon />
                                                    </IconButton>
                                                </CopyToClipboard>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="h6" color="textSecondary">No messages yet. Start the conversation!</Typography>
                        </Box>
                    )}
                </Paper>
                <Box component="form" sx={{ mt: 2, display: 'flex' }} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                        Send
                    </Button>
                </Box>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                {copySuccess && (
                    <Typography color="success" variant="body2" sx={{ mt: 2 }}>
                        {copySuccess}
                    </Typography>
                )}
                <div className='mtt-10'>
                    <ChatDataVisualization refresh={refresh} /> {/* Pass refresh as a prop */}
                </div>
            </Container>
        </Box>
    );
};

export default Chat;
