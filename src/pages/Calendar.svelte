<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    Users,
    BookOpen,
    FileText,
    AlertCircle
  } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { lectures } from '../stores/lectures';
  import { assignments } from '../stores/assignments';
  import { courses } from '../stores/courses';

  let currentDate = new Date();
  let selectedDate: Date | null = null;
  let viewMode: 'month' | 'week' | 'day' = 'month';
  let showEventModal = false;
  let selectedEvent: any = null;

  $: currentMonth = currentDate.getMonth();
  $: currentYear = currentDate.getFullYear();
  $: monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get days in current month
  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  $: firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar grid
  $: calendarDays = generateCalendarDays();

  // Combine lectures and assignments into events
  $: allEvents = [
    ...$lectures.map(lecture => ({
      id: lecture.id,
      type: 'lecture',
      title: lecture.title,
      date: lecture.date,
      time: lecture.time,
      duration: lecture.duration,
      venue: lecture.venue,
      course: lecture.courseName,
      instructor: lecture.instructor,
      color: 'bg-blue-500'
    })),
    ...$assignments.map(assignment => ({
      id: assignment.id,
      type: 'assignment',
      title: assignment.title,
      date: assignment.dueDate.split('T')[0],
      time: assignment.dueDate.split('T')[1]?.slice(0, 5) || '23:59',
      course: assignment.courseName,
      priority: assignment.priority,
      status: assignment.status,
      color: assignment.priority === 'high' ? 'bg-red-500' : 
             assignment.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
    }))
  ];

  function generateCalendarDays() {
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }

  function navigateMonth(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    currentDate = newDate;
  }

  function isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  }

  function isSelected(day: number | null): boolean {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  }

  function getEventsForDay(day: number | null): any[] {
    if (!day) return [];
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return allEvents.filter(event => event.date === dateString);
  }

  function selectDate(day: number | null) {
    if (!day) return;
    selectedDate = new Date(currentYear, currentMonth, day);
  }

  function openEventModal(event: any) {
    selectedEvent = event;
    showEventModal = true;
  }

  function closeEventModal() {
    showEventModal = false;
    selectedEvent = null;
  }

  function formatTime(timeString: string): string {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get today's events
  $: todayEvents = allEvents.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Get upcoming events (next 7 days)
  $: upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= nextWeek;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Academic Calendar</h1>
        <p class="text-gray-600 mt-1">View your lectures, assignments, and important dates</p>
      </div>
      
      <!-- View Mode Toggle -->
      <div class="flex items-center space-x-2">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 {viewMode === 'month' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
            on:click={() => viewMode = 'month'}
          >
            Month
          </button>
          <button
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 {viewMode === 'week' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
            on:click={() => viewMode = 'week'}
          >
            Week
          </button>
          <button
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 {viewMode === 'day' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
            on:click={() => viewMode = 'day'}
          >
            Day
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Main Calendar -->
      <div class="xl:col-span-3">
        <div class="card p-6">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{monthName}</h3>
            <div class="flex items-center space-x-2">
              <button
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                on:click={() => navigateMonth('prev')}
                aria-label="Previous month"
              >
                <ChevronLeft class="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                on:click={() => currentDate = new Date()}
              >
                Today
              </button>
              
              <button
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                on:click={() => navigateMonth('next')}
                aria-label="Next month"
              >
                <ChevronRight class="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <!-- Week Days Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            {#each weekDays as weekDay}
              <div class="text-center text-sm font-medium text-gray-500 py-3">
                {weekDay}
              </div>
            {/each}
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            {#each calendarDays as day}
              <div
                class="min-h-24 p-1 border border-gray-100 {
                  day === null 
                    ? 'bg-gray-50' 
                    : isToday(day)
                      ? 'bg-primary-50 border-primary-200'
                      : isSelected(day)
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50 cursor-pointer'
                }"
                on:click={() => selectDate(day)}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && selectDate(day)}
              >
                {#if day}
                  <div class="text-sm font-medium text-gray-900 mb-1">
                    {day}
                  </div>
                  
                  <!-- Events for this day -->
                  <div class="space-y-1">
                    {#each getEventsForDay(day).slice(0, 3) as event}
                      <button
                        class="w-full text-left px-1 py-0.5 text-xs rounded {event.color} text-white truncate hover:opacity-80 transition-opacity duration-200"
                        on:click|stopPropagation={() => openEventModal(event)}
                      >
                        {event.title}
                      </button>
                    {/each}
                    
                    {#if getEventsForDay(day).length > 3}
                      <div class="text-xs text-gray-500 px-1">
                        +{getEventsForDay(day).length - 3} more
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
          
          <!-- Legend -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex flex-wrap gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded"></div>
                <span class="text-gray-600">Lectures</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded"></div>
                <span class="text-gray-600">High Priority</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-500 rounded"></div>
                <span class="text-gray-600">Medium Priority</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded"></div>
                <span class="text-gray-600">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Today's Events -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div class="space-y-3">
            {#each todayEvents as event}
              <button
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                on:click={() => openEventModal(event)}
              >
                <div class="flex items-start space-x-3">
                  <div class="w-3 h-3 rounded-full {event.color} mt-1.5"></div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p class="text-xs text-gray-600">{event.course}</p>
                    <div class="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <Clock class="w-3 h-3" />
                      <span>{formatTime(event.time)}</span>
                      {#if event.venue}
                        <MapPin class="w-3 h-3" />
                        <span>{event.venue}</span>
                      {/if}
                    </div>
                  </div>
                </div>
              </button>
            {/each}
            
            {#if todayEvents.length === 0}
              <div class="text-center py-4 text-gray-500">
                <CalendarIcon class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p class="text-sm">No events today</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div class="space-y-3">
            {#each upcomingEvents as event}
              <button
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                on:click={() => openEventModal(event)}
              >
                <div class="flex items-start space-x-3">
                  <div class="w-3 h-3 rounded-full {event.color} mt-1.5"></div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p class="text-xs text-gray-600">{event.course}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </p>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <a href="#/lectures" class="w-full btn btn-secondary text-sm py-2 flex items-center justify-center space-x-2">
              <BookOpen class="w-4 h-4" />
              <span>View Lectures</span>
            </a>
            <a href="#/assignments" class="w-full btn btn-secondary text-sm py-2 flex items-center justify-center space-x-2">
              <FileText class="w-4 h-4" />
              <span>View Assignments</span>
            </a>
            <button class="w-full btn btn-secondary text-sm py-2 flex items-center justify-center space-x-2">
              <Plus class="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Event Detail Modal -->
  {#if showEventModal && selectedEvent}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 rounded-full {selectedEvent.color}"></div>
            <h3 class="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600"
            on:click={closeEventModal}
          >
            ×
          </button>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon class="w-4 h-4" />
            <span>{formatDate(selectedEvent.date)}</span>
          </div>
          
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <Clock class="w-4 h-4" />
            <span>{formatTime(selectedEvent.time)}</span>
            {#if selectedEvent.duration}
              <span>({selectedEvent.duration})</span>
            {/if}
          </div>
          
          {#if selectedEvent.venue}
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin class="w-4 h-4" />
              <span>{selectedEvent.venue}</span>
            </div>
          {/if}
          
          {#if selectedEvent.instructor}
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <Users class="w-4 h-4" />
              <span>{selectedEvent.instructor}</span>
            </div>
          {/if}
          
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen class="w-4 h-4" />
            <span>{selectedEvent.course}</span>
          </div>
          
          {#if selectedEvent.priority}
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle class="w-4 h-4" />
              <span class="capitalize">{selectedEvent.priority} Priority</span>
            </div>
          {/if}
        </div>
        
        <div class="flex space-x-3 mt-6">
          {#if selectedEvent.type === 'lecture'}
            <a href="#/lectures/{selectedEvent.id}" class="flex-1 btn btn-primary text-sm">
              View Lecture
            </a>
          {:else}
            <a href="#/assignments" class="flex-1 btn btn-primary text-sm">
              View Assignment
            </a>
          {/if}
          <button
            class="flex-1 btn btn-secondary text-sm"
            on:click={closeEventModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
</Layout>