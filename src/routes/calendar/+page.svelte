<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
    import { derived } from 'svelte/store';

  let calendar: any;
  let calendarEl: HTMLDivElement;
  let currentRange = '';

  const currentUserId  = derived(authStore, $authStore => $authStore?.user?.id);
  console.log("Current User ID:", $currentUserId);

  const calendars = [
    { id: '1', name: 'School', bgColor: '#9e5fff', color: '#fff' },
    { id: '2', name: 'Personal', bgColor: '#00a9ff', color: '#fff' },
  ];

  onMount(async () => {
    const { default: Calendar } = await import('@toast-ui/calendar');
    await import('@toast-ui/calendar/dist/toastui-calendar.min.css');

    calendar = new Calendar(calendarEl, {
      defaultView: 'month',
      useFormPopup: true,
      useDetailPopup: true,
      calendars,
    });
    
    calendar.on('clickEvent',(e:any)=>{
    const btn = document.getElementsByClassName('toastui-calendar-section-button')
    console.log("click btn btn =",e)
    const createdBy = e.event?.raw?.createdBy;
    
     setTimeout(()=>{
      const btn = document.getElementsByClassName('toastui-calendar-section-button')
     
      if(btn.length > 0 && createdBy !== $currentUserId) {  
        btn[0].style.display = 'none';
      }
    },100)

    })

    

     calendar.on('beforeUpdateEvent', (e: any) => {
      console.log('beforeUpdateEvent', e);
      if (e.event?.raw?.createdBy !== $currentUserId) {
        alert('You cannot edit this event.');
       
      }
    });

   

    calendar.on('beforeDeleteEvent', (e: any) => {
      console.log('beforeDeleteEvent', e);
      if (e.raw?.createdBy !== $currentUserId) {
        alert('You cannot delete this event.');
      }
    });

    calendar.on('beforeCreateEvent', (e: any) => {
      // Add createdBy tag when creating new event
      const newEvent = {
        ...e,
        id: String(Date.now()),
        calendarId: e.calendarId || '1',
        title: e.title || 'New Event',
        category: 'time',
        createdBy: $currentUserId
      };
      calendar.createEvents([newEvent]);
    });

   calendar.createEvents([
      {
        id: '1',
        calendarId: '1',
        title: 'Private Event',
        category: 'time',
        start: '2025-06-02T09:00:00',
        end: '2025-06-02T10:00:00',
        raw: {
          createdBy: 'user999' // Not the current user
        }
      },
      {
        id: '2',
        calendarId: '2',
        title: 'Work Meeting',
        category: 'time',
        start: '2025-06-10T13:00:00',
        end: '2025-06-10T14:00:00',
        raw: {
          createdBy: $currentUserId // Created by current user
        }
      }
    ]);

    updateRangeText();
  });

  function changeView(view: string) {
    calendar?.changeView(view);
    updateRangeText();
  }

  function goToday() {
    calendar?.today();
    updateRangeText();
  }

  function goPrev() {
    calendar?.prev();
    updateRangeText();
  }

  function goNext() {
    calendar?.next();
    updateRangeText();
  }

  function updateRangeText() {
    console.log('Current Range before :', currentRange,calendar.getDateRangeStart().d.d);

    if (calendar) {
      const range = calendar.getDateRangeStart().d.d.toDateString() + ' - ' + calendar.getDateRangeEnd().d.d.toDateString();
      currentRange = range;
    }
    console.log('Current Range:', currentRange,calendar.getDateRangeStart());
  }
</script>

<style>
  .header, .navbar, .sidebar {
    background: #fff;
    padding: 10px;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
  }

  .dropdown-menu {
    display: none;
    z-index: 10;
  }

  .navbar--range {
    font-weight: bold;
  }

  .button {
    cursor: pointer;
  }
</style>



<article class="flex h-screen">
  <!-- Sidebar (Optional) -->
  <!-- Uncomment if you want the sidebar calendar filter -->
  <!--
  <aside class="sidebar border-r w-64 p-4">
    <div class="sidebar-item">
      <input type="checkbox" id="all" checked>
      <label for="all">View all</label>
    </div>
    <hr>
    {#each calendars as cal}
      <div class="sidebar-item">
        <input type="checkbox" id={cal.id} value={cal.id} checked>
        <label for={cal.id} class="ml-2" style="color: {cal.bgColor}">{cal.name}</label>
      </div>
    {/each}
    <hr class="my-4" />
    <div class="text-xs">© NHN Cloud Corp.</div>
  </aside>
  -->

  <!-- Calendar Area -->
  <section class="flex-1 flex flex-col">
    <!-- Navbar -->
    <nav class="navbar flex items-center justify-between gap-2 border-b px-4 py-2">
      <div class="flex items-center gap-2">
        <div class="dropdown relative">
          <button class="button px-3 py-1 rounded bg-gray-100 border">View ▼</button>
          <div class="dropdown-menu absolute left-0 bg-white shadow border mt-1 rounded w-32">
            <a href="#" class="block px-4 py-2 hover:bg-gray-100" on:click={() => changeView('month')}>Monthly</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100" on:click={() => changeView('week')}>Weekly</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100" on:click={() => changeView('day')}>Daily</a>
          </div>
        </div>
        <button class="button bg-republic-600 text-white px-3 py-1 rounded" on:click={goToday}>Today</button>
        <button class="button bg-gray-200 px-3 py-1 rounded" on:click={goPrev}>‹</button>
        <button class="button bg-gray-200 px-3 py-1 rounded" on:click={goNext}>›</button>
      </div>
      <span class="navbar--range">{currentRange}</span>
    </nav>

    <!-- Calendar Container -->
    <main bind:this={calendarEl} class="flex-1"></main>
  </section>
</article>
