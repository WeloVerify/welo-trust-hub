
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';

const AdminChat = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      companyName: 'TechCorp Inc.',
      lastMessage: 'When will our verification be completed?',
      timestamp: '2 min ago',
      unread: 2,
      status: 'pending'
    },
    {
      id: 2,
      companyName: 'FinanceFlow Ltd.',
      lastMessage: 'Thank you for the approval!',
      timestamp: '1 hour ago',
      unread: 0,
      status: 'approved'
    },
    {
      id: 3,
      companyName: 'StartupX',
      lastMessage: 'I need help with document upload',
      timestamp: '3 hours ago',
      unread: 1,
      status: 'help'
    }
  ];

  const messages = selectedChat === 1 ? [
    {
      id: 1,
      sender: 'company',
      message: 'Hello, we submitted our documents yesterday. When can we expect a response?',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'admin',
      message: 'Hi! Thanks for reaching out. We typically review applications within 2-3 business days. Your application is currently in our review queue.',
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      sender: 'company',
      message: 'When will our verification be completed?',
      timestamp: '11:45 AM'
    }
  ] : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="container mx-auto py-10 h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-semibold mb-6">Company Support Chat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                    selectedChat === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{conversation.companyName}</h3>
                    <div className="flex items-center gap-2">
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {conversations.find(c => c.id === selectedChat)?.companyName}
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminChat;
