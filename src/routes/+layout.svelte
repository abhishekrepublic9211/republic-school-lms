<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { initializeNavigation, loadNavigationState } from '$lib/stores/navigation';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import '../app.css';

  let sidebarOpen = false;
  let showSidebar = true;
  let showNavbar = true;

  // Determine layout based on current route
  $: {
    const path = $page.url.pathname;
    showSidebar = $isAuthenticated && path !== '/login' && path !== '/';
    showNavbar = true;
  }

  onMount(() => {
    // Initialize navigation system
    initializeNavigation();
    loadNavigationState();
    
    // Handle route protection
    const unsubscribe = isAuthenticated.subscribe(auth => {
      const currentPath = $page.url.pathname;
      
      if (!auth && currentPath !== '/login' && currentPath !== '/') {
        goto('/login');
      } else if (auth && (currentPath === '/login' || currentPath === '/')) {
        goto('/dashboard');
      }
    });

    return unsubscribe;
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if showNavbar}
    <div class="fixed top-0 left-0 right-0 z-50">
      <Navbar on:toggleSidebar={toggleSidebar} />
    </div>
  {/if}
  
  <div class="flex {showNavbar ? 'pt-16' : ''}">
    {#if showSidebar && $isAuthenticated}
      <Sidebar bind:isOpen={sidebarOpen} />
    {/if}
    
    <main class="flex-1 {showSidebar && $isAuthenticated ? 'lg:ml-64' : ''} transition-all duration-300 overflow-y-auto max-h-screen">
      <slot />
    </main>
  </div>
</div>