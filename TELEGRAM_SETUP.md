# Telegram Integration Setup

This document explains how to set up Telegram notifications for the DigiCraft Marketplace.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_IDS=chat_id_1,chat_id_2,chat_id_3

# Email Configuration (for admin notifications)
ADMIN_EMAIL=admin@yourdomain.com
```

## Setting Up Telegram Bot

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` command
   - Follow the instructions to create your bot
   - Save the bot token provided

2. **Get Chat IDs:**
   - For individual users: Message your bot and visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - For groups: Add your bot to the group and visit the same URL
   - Look for the `chat_id` field in the response
   - Multiple chat IDs should be separated by commas

3. **Example Chat IDs:**
   ```
   TELEGRAM_CHAT_IDS=123456789,987654321,555666777
   ```

## Features

- **Multiple Chat Support:** Send notifications to multiple Telegram chats simultaneously
- **Formatted Messages:** Rich text formatting with emojis and structured information
- **Error Handling:** Graceful error handling with detailed logging
- **Environment Configuration:** Flexible configuration through environment variables

## Message Format

When a new enquiry is submitted, the following information is sent to Telegram:

```
🚀 New Form Submission!

👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: +1234567890
📝 Message: I'm interested in your product
🛍️ Product: Premium Widget
📋 Category: Electronics
🔧 Adjustment Type: Customization

⏰ Time: 12/25/2023, 2:30:45 PM
```

## API Usage

```typescript
import { sendTelegramMessage, sendEnquiryNotification } from '@/lib/telegram';

// Send custom message
const result = await sendTelegramMessage({
    text: "Hello from DigiCraft! 🚀"
});

// Send enquiry notification
const result = await sendEnquiryNotification({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    message: "I'm interested in your product",
    product: { title: "Premium Widget", category: "Electronics" },
    adjustmentType: "Customization"
});
```

## Troubleshooting

1. **Bot Token Issues:**
   - Ensure the bot token is correct
   - Check that the bot is active

2. **Chat ID Issues:**
   - Verify chat IDs are correct
   - Ensure the bot has permission to send messages to the chat
   - For groups, make sure the bot is added as an admin

3. **Environment Variables:**
   - Check that all required environment variables are set
   - Restart your development server after adding new environment variables

## Security Notes

- Never commit your bot token to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your bot token if needed 