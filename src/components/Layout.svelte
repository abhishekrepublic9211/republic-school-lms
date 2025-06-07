<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, isAuthenticated } from '../stores/auth';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';
  import { push } from 'svelte-spa-router';

  export let showSidebar = true;
  export let showNavbar = true;

  let sidebarOpen = false;

  onMount(() => {
    // Redirect to login if not authenticated and not on login page
    const unsubscribe = isAuthenticated.subscribe(auth => {
      if (!auth && window.location.hash !== '#/login' && window.location.hash !== '#/') {
        push('/login');
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