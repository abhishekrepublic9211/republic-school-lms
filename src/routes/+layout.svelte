<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { initializeNavigation, loadNavigationState } from '$lib/stores/navigation';
  import { authStore } from '../lib/stores/auth';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import '../app.css';

  let sidebarOpen = false;
  let showSidebar = true;
  let showNavbar = true;

  $: currentUser = $authStore.user;
  $: isAuthenticated = $authStore.isAuthenticated;
  console.log("currentUser layout  =", currentUser);

  onMount(() => {
    initializeNavigation();
    loadNavigationState();

    // The subscription for currentUser and isAuthenticated is now handled by reactive declarations.
    // This onMount block is primarily for initial navigation logic.
    const unsubscribe = authStore.subscribe(auth => {
      const currentPath = $page.url.pathname;
      
      console.log("isAuthenticated",isAuthenticated)
     
      if(isAuthenticated){ // Use isAuthenticated directly
        console.log("User is authenticated layout:", isAuthenticated,auth);
         sidebarOpen=true;
      }

      if (!auth.isAuthenticated) {
        goto('/login');
      } 
      else if (auth.isAuthenticated && (currentPath === '/login' || currentPath === '/')) {
       
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

  <div class="flex" class:pt-16={showNavbar}>
    {#if showSidebar && isAuthenticated}
      <Sidebar bind:isOpen={sidebarOpen} />
    {/if}

     <main class="flex-1 {showSidebar && isAuthenticated ? 'lg:ml-64' : ''} transition-all duration-300 overflow-y-auto max-h-screen">
      <slot />
    </main>
  </div>
</div>
