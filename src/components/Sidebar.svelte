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
  import { currentUser } from '../stores/auth';

  export let isOpen = false;

  const navItems = [
    { href: '#/dashboard', label: 'Dashboard', icon: Home },
    { href: '#/profile', label: 'Profile', icon: User },
    { href: '#/courses', label: 'Courses', icon: BookOpen },
    { href: '#/assignments', label: 'Assignments', icon: FileText },
    { href: '#/lectures', label: 'Lectures', icon: Users },
    { href: '#/attendance', label: 'Attendance', icon: CheckSquare },
    { href: '#/grades', label: 'Grades', icon: BarChart3 },
    { href: '#/calendar', label: 'Calendar', icon: Calendar },
    { href: '#/chat', label: 'Chat', icon: MessageCircle },
    { href: '#/doubts', label: 'Doubts', icon: HelpCircle },
    { href: '#/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '#/payments', label: 'Payments', icon: CreditCard },
    { href: '#/settings', label: 'Settings', icon: Settings }
  ];

  function isActive(href: string): boolean {
    return window.location.hash === href;
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
          class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 {isActive(item.href) ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
          on:click={() => isOpen = false}
        >
          <svelte:component 
            this={item.icon} 
            class="w-5 h-5 {isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}" 
          />
          <span class="font-medium">{item.label}</span>
        </a>
      {/each}
    </nav>
  </div>
</aside>