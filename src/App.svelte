<script lang="ts">
  import router from 'svelte-spa-router';
  import { routes } from './routes';
  import { onMount } from 'svelte';
  import { isAuthenticated } from './stores/auth';
  import { push } from 'svelte-spa-router';
  import './app.css';

  onMount(() => {
    // Check authentication status on app load
    const unsubscribe = isAuthenticated.subscribe(auth => {
      const currentPath = window.location.hash.slice(1) || '/';
      
      // If not authenticated and trying to access protected routes
      if (!auth && currentPath !== '/login' && currentPath !== '/') {
        push('/login');
      }
      // If authenticated and on login page, redirect to dashboard
      else if (auth && (currentPath === '/login' || currentPath === '/')) {
        push('/dashboard');
      }
    });

    return unsubscribe;
  });
</script>

<main>
  <svelte:component this={router} {routes} />
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }
</style>