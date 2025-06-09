<script lang="ts">
  import { 
    Home, 
    BookOpen, 
    FileText, 
    Calendar, 
    MessageCircle, 
    HelpCircle, 
    Settings, 
    User,
    CreditCard,
    Users,
    CheckSquare,
    BarChart3,
    MessageSquare
  } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/stores/auth';
  import { activeNavItem, initializeNavigation, updateActiveNavigation, isPathActive } from '$lib/stores/navigation';

  export let isOpen = false;

  const navItems = [
    { id: 'nav-dashboard', href: '/dashboard', label: 'Dashboard', icon: Home },
    { id: 'nav-profile', href: '/profile', label: 'Profile', icon: User },
    { id: 'nav-courses', href: '/courses', label: 'Courses', icon: BookOpen },
    { id: 'nav-assignments', href: '/assignments', label: 'Assignments', icon: FileText },
    { id: 'nav-lectures', href: '/lectures', label: 'Lectures', icon: Users },
    { id: 'nav-attendance', href: '/attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'nav-grades', href: '/grades', label: 'Grades', icon: BarChart3 },
    { id: 'nav-calendar', href: '/calendar', label: 'Calendar', icon: Calendar },
    { id: 'nav-chat', href: '/chat', label: 'Chat', icon: MessageCircle },
    { id: 'nav-doubts', href: '/doubts', label: 'Doubts', icon: HelpCircle },
    { id: 'nav-feedback', href: '/feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'nav-payments', href: '/payments', label: 'Payments', icon: CreditCard },
    { id: 'nav-settings', href: '/settings', label: 'Settings', icon: Settings }
  ];

  onMount(() => {
    initializeNavigation();
    
    // Update navigation when page changes
    const unsubscribe = page.subscribe(($page) => {
      if ($page?.url?.pathname) {
        updateActiveNavigation($page.url.pathname);
      }
    });
    
    return unsubscribe;
  });

  function handleNavClick(href: string) {
    updateActiveNavigation(href);
    isOpen = false;
  }
</script>

{#if isOpen}
  <!-- Mobile overlay -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    on:click={() => isOpen = false}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && (isOpen = false)}
    aria-label="Close sidebar"
  ></div>
{/if}

<!-- Sidebar -->
<aside 
  class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 {isOpen ? 'translate-x-0' : '-translate-x-full'}"
  role="navigation"
  aria-label="Main navigation"
>
  <div class="flex flex-col h-full">
    <!-- Student Profile -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <img 
          src={$currentUser?.avatar} 
          alt={$currentUser?.name}
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 truncate">{$currentUser?.name}</h3>
          <p class="text-xs text-gray-500 truncate">{$currentUser?.email}</p>
          <div class="flex items-center space-x-4 mt-1">
            <span class="text-xs text-gray-400">{$currentUser?.enrolledCourses?.length || 0} courses</span>
            <span class="text-xs text-primary-600">{$currentUser?.completedCourses?.length || 0} completed</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2" aria-label="Sidebar navigation">
      {#each navItems as item}
        <a
          href={item.href}
          class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 nav-transition {isPathActive(item.href) ? 'nav-item-active' : 'nav-item-inactive'}"
          on:click={() => handleNavClick(item.href)}
          data-nav-id={item.id}
          aria-current={isPathActive(item.href) ? 'page' : undefined}
        >
          <svelte:component 
            this={item.icon} 
            class="w-5 h-5 transition-colors duration-200 {isPathActive(item.href) ? 'text-primary-600' : 'text-gray-400'}" 
          />
          <span class="font-medium transition-colors duration-200">{item.label}</span>
          
          <!-- Active indicator -->
          {#if isPathActive(item.href)}
            <div class="ml-auto w-2 h-2 bg-primary-600 rounded-full animate-pulse-subtle"></div>
          {/if}
        </a>
      {/each}
    </nav>
  </div>
</aside>