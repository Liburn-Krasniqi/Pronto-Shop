import React from 'react';
import classes from './HelpAI.module.css';

interface HelpAIButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function HelpAIButton({ onClick, isOpen }: HelpAIButtonProps) {
  return (
    <button
      className={`${classes.helpButton} ${isOpen ? classes.active : ''}`}
      onClick={onClick}
      aria-label="Help AI Assistant"
      title="Get help from AI assistant"
    >
      {isOpen ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.09 9C9.3251 8.33167 9.78918 7.76811 10.4 7.40921C11.0108 7.0503 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52252 14.2151 8.06383C14.6713 8.60514 14.9211 9.30196 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
} 