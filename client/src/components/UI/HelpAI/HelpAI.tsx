import React, { useState, useRef, useEffect } from 'react';
import classes from './HelpAI.module.css';
import { HelpAIChat } from './HelpAIChat';
import { HelpAIButton } from './HelpAIButton';
import { HelpAIService } from '../../../api/helpAI';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function HelpAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your ProntoShop assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const aiService = HelpAIService.getInstance();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use the AI service to generate response
      const aiResponse = await aiService.generateResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HelpAIButton onClick={handleToggle} isOpen={isOpen} />
      {isOpen && (
        <HelpAIChat
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={handleToggle}
          isLoading={isLoading}
        />
      )}
    </>
  );
} 