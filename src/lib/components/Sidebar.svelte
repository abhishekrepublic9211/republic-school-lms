<script lang="ts">
  import {
    Home,
    User,
    CreditCard,
  } from "lucide-svelte";

  export let isOpen = false;

  const navItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/payments", label: "Payments", icon: CreditCard },
  ];
</script>

{#if isOpen}
  <!-- Mobile overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    on:click={() => (isOpen = false)}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === "Enter" && (isOpen = false)}
    aria-label="Close sidebar"
  ></div>
{/if}

<!-- Sidebar -->
<aside
  class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 {isOpen
    ? 'translate-x-0'
    : '-translate-x-full'}"
  role="navigation"
  aria-label="Main navigation"
>
  <div class="flex flex-col h-full">
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Sidebar navigation">
      <!-- Main Navigation -->
      <div class="space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 nav-transition"
            on:click={() => (isOpen = false)}
          >
            <svelte:component
              this={item.icon}
              class="w-5 h-5 transition-colors duration-200 text-gray-400"
            />
            <span class="font-medium transition-colors duration-200"
              >{item.label}</span
            >
          </a>
        {/each}
      </div>
    </nav>
  </div>
</aside>
