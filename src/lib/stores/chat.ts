import { writable } from 'svelte/store';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'course' | 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  courseId?: string;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Digital Journalism Fundamentals',
    type: 'course',
    participants: ['1', '2', '3', '4'],
    courseId: '1',
    unreadCount: 3,
    lastMessage: {
      id: '1',
      senderId: '2',
      senderName: 'Dr. Michael Chen',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      content: 'Remember to submit your assignments by Friday!',
      timestamp: '2024-01-28T14:30:00',
      type: 'text',
      isRead: false
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    type: 'direct',
    participants: ['1', '2'],
    unreadCount: 1,
    lastMessage: {
      id: '2',
      senderId: '2',
      senderName: 'Dr. Michael Chen',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      content: 'Great work on your latest assignment!',
      timestamp: '2024-01-28T10:15:00',
      type: 'text',
      isRead: false
    }
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Dr. Michael Chen',
    senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    content: 'Welcome to the Digital Journalism course chat! Feel free to ask questions here.',
    timestamp: '2024-01-25T09:00:00',
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    content: 'Thank you! Looking forward to learning.',
    timestamp: '2024-01-25T09:15:00',
    type: 'text',
    isRead: true
  }
];

export const chatRooms = writable<ChatRoom[]>(mockChatRooms);
export const currentChatRoom = writable<ChatRoom | null>(null);
export const chatMessages = writable<ChatMessage[]>(mockMessages);