# Notification System in GenesisNet

This document explains how the notification system works in GenesisNet and how to test it.

## Overview

The notification system consists of:

1. **NotificationContext**: Provides state management for notifications across the application
2. **NotificationProvider**: Wraps the application with the notification context
3. **NotificationCenter**: UI component that displays notifications and manages their interactions

## Features

- Different notification severities: info, success, warning, error
- Categories: system, transaction, network, agent, download
- Types: persistent (stays until dismissed) and toast (auto-dismisses)
- Action buttons on notifications
- Unread notification count indicator
- Mark all as read functionality
- Clear all notifications functionality

## Testing the Notification System

### Automatic Notifications

The system automatically generates the following notifications:

1. **Welcome notification** - Generated when Dashboard mounts
2. **System Status notification** - Generated when Dashboard mounts
3. **Sample transaction notification** - Generated 3 seconds after Dashboard mounts
4. **Network scan notifications** - Generated when performing a network scan
5. **Agent notifications** - Generated when starting an agent
6. **Negotiation notifications** - Generated during provider negotiations

### Manual Testing

1. **Test notification button**: Click the bell icon next to the notification center to generate random test notifications
2. **Network scan**: Trigger network scanning to generate scan-related notifications
3. **Agent actions**: Start agents to trigger agent-related notifications
4. **Negotiations**: Negotiate with providers to trigger transaction notifications

### Debugging

- Open the browser console to see debug logs from the notification system
- Look for logs prefixed with "NotificationCenter:" to see detailed information about the current notifications state

## Implementation Details

The notification system is implemented using React Context API for state management and React hooks for component integration. The `NotificationContext.jsx` file contains all the logic for adding, dismissing, and managing notifications, while the `NotificationCenter.jsx` component provides the UI for displaying and interacting with notifications.

## Common Issues and Solutions

1. **No notifications appear**
   - Check that `NotificationProvider` is properly wrapping the application in `App.jsx`
   - Verify that `useNotifications` hook is imported and used in components that need it
   - Check browser console for errors

2. **Notifications appear but don't update**
   - Make sure dependency arrays in useEffect calls include all necessary variables
   - Check that state updates are happening correctly

3. **Notifications don't disappear when cleared**
   - Verify that the `dismissNotification` function is being called correctly
   - Check that notification IDs are being passed correctly

4. **Toast notifications don't auto-dismiss**
   - Check that the duration property is set correctly
   - Ensure the setTimeout logic in the NotificationContext is working properly
