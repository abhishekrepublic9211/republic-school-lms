<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { Menu, Search, Bell, User, LogOut } from 'lucide-svelte';
  import { currentUser, isAuthenticated, logout } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import { activeNavItem, updateActiveNavigation } from '$lib/stores/navigation';

  const dispatch = createEventDispatcher();

  let searchQuery = '';
  let showProfileMenu = false;
  let showNotifications = false;
  
  // Get current page title based on active navigation
  $: pageTitle = getPageTitle($activeNavItem);
  
  function getPageTitle(path: string): string {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/profile': 'Profile',
      '/courses': 'Courses',
      '/assignments': 'Assignments',
      '/lectures': 'Lectures',
      '/attendance': 'Attendance',
      '/grades': 'Grades',
      '/calendar': 'Calendar',
      '/chat': 'Chat',
      '/doubts': 'Doubts',
      '/feedback': 'Feedback',
      '/payments': 'Payments',
      '/settings': 'Settings'
    };
    
    return titles[path] || 'Republic School of Journalism';
  }

  function handleSearch() {
    console.log('Searching for:', searchQuery);
  }

  function handleLogout() {
    logout();
    updateActiveNavigation('/login');
  }

  function toggleProfileMenu() {
    showProfileMenu = !showProfileMenu;
    showNotifications = false;
  }

  function toggleNotifications() {
    showNotifications = !showNotifications;
    showProfileMenu = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.dropdown')) {
      showProfileMenu = false;
      showNotifications = false;
    }
  }
  
  onMount(() => {
    // Update navigation when page changes
    const unsubscribe = page.subscribe(($page) => {
      if ($page?.url?.pathname) {
        updateActiveNavigation($page.url.pathname);
      }
    });
    
    return unsubscribe;
  });
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 relative">
  <div class="flex items-center justify-between">
    <!-- Left side -->
    <div class="flex items-center space-x-4">
      {#if $isAuthenticated}
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          on:click={() => dispatch('toggleSidebar')}
          aria-label="Toggle sidebar"
        >
          <Menu class="w-5 h-5 text-gray-600" />
        </button>
      {/if}

      <!-- Logo and Page Title -->
      <div class="flex items-center space-x-4">
        <a href={$isAuthenticated ? "/dashboard" : "/"} class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">R</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900">Republic School</h1>
            <p class="text-xs text-gray-500">of Journalism</p>
          </div>
        </a>
        
        <!-- Page Title Separator -->
        {#if $isAuthenticated && pageTitle !== 'Republic School of Journalism'}
          <div class="hidden md:flex items-center space-x-2">
            <div class="w-px h-6 bg-gray-300"></div>
            <h2 class="text-lg font-semibold text-gray-700">{pageTitle}</h2>
          </div>
        {/if}
      </div>
    </div>

    <!-- Center - Search (only when authenticated) -->
    {#if $isAuthenticated}
      <div class="hidden md:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, assignments..."
            bind:value={searchQuery}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
          />
        </div>
      </div>
    {/if}

    <!-- Right side -->
    <div class="flex items-center space-x-2">
      {#if $isAuthenticated}
        <!-- Mobile search -->
        <button
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Search"
        >
          <Search class="w-5 h-5 text-gray-600" />
        </button>

        <!-- Notifications -->
        <div class="relative dropdown">
          <button
            class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            on:click={toggleNotifications}
            aria-label="Notifications"
          >
            <Bell class="w-5 h-5 text-gray-600" />
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {#if showNotifications}
            <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-slide-in">
              <div class="p-4 border-b border-gray-100">
                <h3 class="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div class="p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors duration-200">
                  <p class="text-sm font-medium text-gray-900">New assignment posted</p>
                  <p class="text-xs text-gray-500 mt-1">Digital Journalism Fundamentals</p>
                </div>
                <div class="p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors duration-200">
                  <p class="text-sm font-medium text-gray-900">Grade available</p>
                  <p class="text-xs text-gray-500 mt-1">Interview Transcript - 88/100</p>
                </div>
                <div class="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <p class="text-sm font-medium text-gray-900">New message from instructor</p>
                  <p class="text-xs text-gray-500 mt-1">Dr. Michael Chen</p>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Profile -->
        <div class="relative dropdown">
          <button
            class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            on:click={toggleProfileMenu}
            aria-label="Profile menu"
          >
            <img 
              src={$currentUser?.avatar} 
              alt={$currentUser?.name}
              class="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary-200 transition-all duration-200"
            />
            <span class="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">
              {$currentUser?.name}
            </span>
          </button>

          {#if showProfileMenu}
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-slide-in">
              <div class="p-4 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <img 
                    src={$currentUser?.avatar} 
                    alt={$currentUser?.name}
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{$currentUser?.name}</p>
                    <p class="text-sm text-gray-500">{$currentUser?.email}</p>
                  </div>
                </div>
              </div>
              <div class="p-2">
                <a href="/profile" class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2">
                  <User class="w-4 h-4" />
                  <span>Profile</span>
                </a>
                <a href="/settings" class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  Settings
                </a>
                <hr class="my-2 border-gray-100" />
                <button 
                  class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  on:click={handleLogout}
                >
                  <LogOut class="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- Login button for non-authenticated users -->
        <a href="/login" class="btn btn-primary">
          Sign In
        </a>
      {/if}
    </div>
  </div>
  
  <!-- Active page indicator -->
  {#if $isAuthenticated}
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform origin-left transition-transform duration-300"></div>
  {/if}
</nav>

<style>
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.2s ease-out;
  }
</style>