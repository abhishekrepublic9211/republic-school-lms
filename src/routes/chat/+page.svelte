<script lang="ts">
  import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-svelte';
  import { chatRooms, currentChatRoom, chatMessages } from '$lib/stores/chat';
  import { currentUser } from '$lib/stores/auth';
  import type { ChatRoom, ChatMessage } from '$lib/stores/chat';

  let selectedRoom: ChatRoom | null = null;
  let newMessage = '';
  let searchQuery = '';

  // Filter chat rooms based on search
  $: filteredRooms = $chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectRoom(room: ChatRoom) {
    selectedRoom = room;
    currentChatRoom.set(room);
    // Mark messages as read
    room.unreadCount = 0;
  }

  function sendMessage() {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: $currentUser?.id || '1',
      senderName: $currentUser?.name || 'You',
      senderAvatar: $currentUser?.avatar || '',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    };

    chatMessages.update(messages => [...messages, message]);
    newMessage = '';
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // Get messages for selected room
  $: roomMessages = selectedRoom ? $chatMessages.filter(msg => 
    // This is a simplified filter - in a real app, you'd filter by room ID
    true
  ) : [];
</script>

<svelte:head>
  <title>Chat - Republic School of Journalism</title>
</svelte:head>

<div class="h-[calc(100vh-4rem)] flex">
  <!-- Chat Rooms Sidebar -->
  <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-900 mb-3">Messages</h1>
      
      <!-- Search -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          bind:value={searchQuery}
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>

    <!-- Chat Rooms List -->
    <div class="flex-1 overflow-y-auto">
      {#each filteredRooms as room}
        <button
          class="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200 {selectedRoom?.id === room.id ? 'bg-primary-50 border-primary-200' : ''}"
          on:click={() => selectRoom(room)}
        >
          <div class="flex items-start space-x-3">
            <div class="relative">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-semibold">
                  {room.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {#if room.unreadCount > 0}
                <div class="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {room.unreadCount}
                </div>
              {/if}
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 truncate">{room.name}</h3>
                {#if room.lastMessage}
                  <span class="text-xs text-gray-500">
                    {new Date(room.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                {/if}
              </div>
              
              {#if room.lastMessage}
                <p class="text-sm text-gray-600 truncate mt-1">
                  {room.lastMessage.senderName}: {room.lastMessage.content}
                </p>
              {/if}
              
              <div class="flex items-center mt-1">
                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {room.type === 'course' ? 'Course' : room.type === 'direct' ? 'Direct' : 'Group'}
                </span>
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Chat Area -->
  <div class="flex-1 flex flex-col">
    {#if selectedRoom}
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-semibold">
                {selectedRoom.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 class="font-semibold text-gray-900">{selectedRoom.name}</h2>
              <p class="text-sm text-gray-500">
                {selectedRoom.participants.length} participant{selectedRoom.participants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Phone class="w-5 h-5" />
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Video class="w-5 h-5" />
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreVertical class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {#each roomMessages as message}
          <div class="flex {message.senderId === $currentUser?.id ? 'justify-end' : 'justify-start'}">
            <div class="flex items-start space-x-2 max-w-xs lg:max-w-md">
              {#if message.senderId !== $currentUser?.id}
                <img 
                  src={message.senderAvatar} 
                  alt={message.senderName}
                  class="w-8 h-8 rounded-full object-cover"
                />
              {/if}
              
              <div class="flex flex-col">
                {#if message.senderId !== $currentUser?.id}
                  <span class="text-xs text-gray-500 mb-1">{message.senderName}</span>
                {/if}
                
                <div class="px-4 py-2 rounded-lg {
                  message.senderId === $currentUser?.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }">
                  <p class="text-sm">{message.content}</p>
                </div>
                
                <span class="text-xs text-gray-400 mt-1 {message.senderId === $currentUser?.id ? 'text-right' : 'text-left'}">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {#if message.senderId === $currentUser?.id}
                <img 
                  src={message.senderAvatar} 
                  alt={message.senderName}
                  class="w-8 h-8 rounded-full object-cover"
                />
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <div class="flex items-end space-x-2">
          <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Paperclip class="w-5 h-5" />
          </button>
          
          <div class="flex-1 relative">
            <textarea
              bind:value={newMessage}
              on:keydown={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            ></textarea>
          </div>
          
          <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Smile class="w-5 h-5" />
          </button>
          
          <button 
            on:click={sendMessage}
            disabled={!newMessage.trim()}
            class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    {:else}
      <!-- No Chat Selected -->
      <div class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p class="text-gray-500">Choose a chat room from the sidebar to start messaging</p>
        </div>
      </div>
    {/if}
  </div>
</div>