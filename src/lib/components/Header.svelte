<script lang="ts">
  import { Search, Bell, Menu, User, HelpCircle } from 'lucide-svelte';
  import { student, sidebarOpen } from '../stores/dashboard';
  
  let searchQuery = '';
  let showNotifications = false;
  let showProfile = false;
  let notificationCount = 3;

  function toggleSidebar() {
    sidebarOpen.update(open => !open);
  }

  function handleSearch() {
    console.log('Searching for:', searchQuery);
  }

  function toggleNotifications() {
    showNotifications = !showNotifications;
    showProfile = false;
  }

  function toggleProfile() {
    showProfile = !showProfile;
    showNotifications = false;
  }

  function handleHelp() {
    console.log('Help clicked');
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.dropdown')) {
      showNotifications = false;
      showProfile = false;
    }
  }

  const mockNotifications = [
    { id: 1, title: 'New assignment posted', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Grade available for Web Design', time: '4 hours ago', type: 'success' },
    { id: 3, title: 'Assignment due tomorrow', time: '1 day ago', type: 'warning' }
  ];
</script>

<svelte:window on:click={handleClickOutside} />

<header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4 md:px-6">
  <div class="flex items-center justify-between">
    <!-- Left side -->
    <div class="flex items-center space-x-4">
      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        on:click={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Dashboard title -->
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    </div>

    <!-- Center - Search -->
    <div class="hidden md:flex flex-1 max-w-md mx-8">
      <div class="relative w-full">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search here..."
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
          aria-label="Search"
        />
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center space-x-2">
      <!-- Mobile search button -->
      <button
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="Search"
      >
        <Search class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Help button -->
      <button
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        on:click={handleHelp}
        aria-label="Help"
      >
        <HelpCircle class="w-5 h-5 text-gray-600" />
      </button>

      <!-- Notifications -->
      <div class="relative dropdown">
        <button
          class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          on:click={toggleNotifications}
          aria-label="Notifications"
          aria-expanded={showNotifications}
        >
          <Bell class="w-5 h-5 text-gray-600" />
          {#if notificationCount > 0}
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          {/if}
        </button>

        {#if showNotifications}
          <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-slide-in">
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div class="max-h-80 overflow-y-auto">
              {#each mockNotifications as notification}
                <div class="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors duration-200">
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 rounded-full mt-2 {notification.type === 'info' ? 'bg-blue-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'}"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p class="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
            <div class="p-4 border-t border-gray-100">
              <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Profile -->
      <div class="relative dropdown">
        <button
          class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          on:click={toggleProfile}
          aria-label="Profile menu"
          aria-expanded={showProfile}
        >
          <img 
            src={$student.avatar} 
            alt={$student.name}
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">
            {$student.name}
          </span>
        </button>

        {#if showProfile}
          <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-slide-in">
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center space-x-3">
                <img 
                  src={$student.avatar} 
                  alt={$student.name}
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-medium text-gray-900">{$student.name}</p>
                  <p class="text-sm text-gray-500">{$student.email}</p>
                </div>
              </div>
            </div>
            <div class="p-2">
              <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                Profile Settings
              </button>
              <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                Account Preferences
              </button>
              <hr class="my-2 border-gray-100" />
              <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                Sign out
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>