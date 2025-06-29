# HelpAI Chat Component

A floating AI chat assistant for ProntoShop that provides help and support to users.

## Features

- **Floating Button**: Fixed position button in the bottom-right corner
- **Chat Interface**: Modern chat UI with message history
- **Responsive Design**: Works on desktop and mobile devices
- **Typing Indicators**: Shows when AI is generating a response
- **Message Timestamps**: Displays time for each message
- **Easy Integration**: Simple to integrate with any AI service

## Components

### HelpAI
Main component that manages the chat state and AI service integration.

### HelpAIButton
Floating button component that toggles the chat interface.

### HelpAIChat
Chat interface component with message display and input field.

## Usage

The HelpAI component is automatically included in all layouts:
- Main Layout (customer pages)
- Vendor Layout (vendor dashboard)
- Admin Layout (admin dashboard)

## AI Service Integration

The component uses a mock AI service by default. To integrate with a real AI service:

### 1. Update the HelpAIService

Edit `client/src/api/helpAI.ts` and replace the `generateResponse` method:

```typescript
// Example with OpenAI
public async generateResponse(userMessage: string): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        message: userMessage,
        context: 'ProntoShop e-commerce platform'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return {
      message: data.message,
      confidence: data.confidence || 0.8
    };
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
}
```

### 2. Backend API Endpoint

Create a backend endpoint to handle AI requests:

```typescript
// Example NestJS controller
@Post('ai/chat')
async chatWithAI(@Body() body: { message: string; context: string }) {
  // Integrate with OpenAI, Claude, or other AI service
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for ProntoShop, an e-commerce platform. 
        Provide helpful, accurate information about shopping, orders, returns, 
        vendor registration, and customer support.`
      },
      {
        role: "user",
        content: body.message
      }
    ]
  });

  return {
    message: response.choices[0].message.content,
    confidence: 0.9
  };
}
```

## Supported AI Services

The component can be easily adapted to work with:

- **OpenAI GPT** (ChatGPT)
- **Anthropic Claude**
- **Google Gemini**
- **Azure OpenAI**
- **Custom AI Models**

## Customization

### Styling
Modify `HelpAI.module.css` to customize the appearance:

```css
.helpButton {
  /* Customize floating button */
}

.chatContainer {
  /* Customize chat window */
}

.messageContent {
  /* Customize message bubbles */
}
```

### Behavior
Update the `HelpAI.tsx` component to modify:

- Initial welcome message
- Error handling
- Message persistence
- User preferences

### Topics
Extend the AI responses in `helpAI.ts` to cover additional topics:

- Product recommendations
- Technical support
- Account security
- Payment troubleshooting
- Shipping tracking

## Environment Variables

Add these to your `.env` file when integrating with AI services:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_AI_SERVICE_URL=your_ai_service_endpoint
```

## Performance Considerations

- Messages are stored in component state (not persisted)
- Consider adding message persistence for better UX
- Implement rate limiting for AI API calls
- Add caching for common questions

## Accessibility

The component includes:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Chat not appearing
- Check if the component is imported in the layout
- Verify CSS is loading correctly
- Check browser console for errors

### AI responses not working
- Verify AI service integration
- Check network requests
- Ensure API keys are configured

### Styling issues
- Check CSS module imports
- Verify responsive breakpoints
- Test on different screen sizes 