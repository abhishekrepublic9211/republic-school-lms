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

  function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  let authenticated = typeof document !== 'undefined' && getCookie('isAuthenticated') === 'true' ? 'true' : 'false';

  console.log("authenticated",authenticated);

  
  // Determine layout based on current route
  $: {
    const path = $page.url.pathname;
    showSidebar = authenticated =='true' && path !== '/login' && path !== '/';
    showNavbar = true;
  }

   console.log("showSidebar",showSidebar);

  onMount(() => {
    // Initialize navigation system
    initializeNavigation();
    loadNavigationState();
    
    // Handle route protection
    const unsubscribe = isAuthenticated.subscribe(auth => {
      const currentPath = $page.url.pathname;
      console.log("checking authentication status in layout svelte routes:", auth);
      if (authenticated=='false') {
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
