import React, { useState, useRef, useEffect } from 'react';
import classes from './HelpAI.module.css';
import { Message } from './HelpAI';

interface HelpAIChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export function HelpAIChat({ messages, onSendMessage, onClose, isLoading }: HelpAIChatProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={classes.chatOverlay}>
      <div className={classes.chatContainer}>
        <div className={classes.chatHeader}>
          <div className={classes.chatTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.09 9C9.3251 8.33167 9.78918 7.76811 10.4 7.40921C11.0108 7.0503 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52252 14.2151 8.06383C14.6713 8.60514 14.9211 9.30196 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
            <span>ProntoShop Assistant</span>
          </div>
          <button className={classes.closeButton} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={classes.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${classes.message} ${
                message.sender === 'user' ? classes.userMessage : classes.aiMessage
              }`}
            >
              <div className={classes.messageContent}>
                <div className={classes.messageText}>
                  {message.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className={classes.messageTime}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${classes.message} ${classes.aiMessage}`}>
              <div className={classes.messageContent}>
                <div className={classes.typingIndicator}>
                  <div className={classes.typingDot}></div>
                  <div className={classes.typingDot}></div>
                  <div className={classes.typingDot}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={classes.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about ProntoShop..."
            className={classes.messageInput}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={classes.sendButton}
            disabled={!inputText.trim() || isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
} 