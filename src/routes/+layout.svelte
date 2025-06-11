<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../app.css";

  let sidebarOpen = false;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="fixed top-0 left-0 right-0 z-50">
    <Navbar on:toggleSidebar={toggleSidebar} />
  </div>

  <div class="flex pt-16">
    <Sidebar bind:isOpen={sidebarOpen} />

    <main class="flex-1 lg:ml-64 transition-all duration-300 overflow-y-auto max-h-screen">
      <slot />
    </main>
  </div>
</div>
