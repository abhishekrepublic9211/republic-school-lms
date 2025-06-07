<script lang="ts">
  import { Search, Filter, Calendar, Clock, MapPin, Users, Play, Download } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { lectures } from '../stores/lectures';
  import { courses } from '../stores/courses';

  let searchQuery = '';
  let selectedCourse = 'All';
  let selectedDate = '';
  let sortBy = 'date';

  // Get unique courses for filter
  $: availableCourses = ['All', ...new Set($lectures.map(lecture => lecture.courseName))];

  // Filter and sort lectures
  $: filteredLectures = $lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lecture.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lecture.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || lecture.courseName === selectedCourse;
    const matchesDate = !selectedDate || lecture.date === selectedDate;
    
    return matchesSearch && matchesCourse && matchesDate;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
      case 'course':
        return a.courseName.localeCompare(b.courseName);
      case 'instructor':
        return a.instructor.localeCompare(b.instructor);
      default:
        return 0;
    }
  });

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(timeString: string): string {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function isUpcoming(date: string, time: string): boolean {
    const lectureDateTime = new Date(`${date}T${time}`);
    return lectureDateTime > new Date();
  }

  function isPast(date: string, time: string): boolean {
    const lectureDateTime = new Date(`${date}T${time}`);
    return lectureDateTime < new Date();
  }

  function isToday(date: string): boolean {
    const lectureDate = new Date(date);
    const today = new Date();
    return lectureDate.toDateString() === today.toDateString();
  }
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Lectures</h1>
        <p class="text-gray-600 mt-1">View and manage your lecture schedule</p>
      </div>
      <div class="text-sm text-gray-500">
        {filteredLectures.length} lecture{filteredLectures.length !== 1 ? 's' : ''} found
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lectures..."
              bind:value={searchQuery}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Course Filter -->
        <div>
          <select 
            bind:value={selectedCourse}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each availableCourses as course}
              <option value={course}>{course}</option>
            {/each}
          </select>
        </div>

        <!-- Date Filter -->
        <div>
          <input
            type="date"
            bind:value={selectedDate}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Sort -->
        <div>
          <select 
            bind:value={sortBy}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Sort by Date</option>
            <option value="course">Sort by Course</option>
            <option value="instructor">Sort by Instructor</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lectures List -->
    <div class="space-y-4">
      {#each filteredLectures as lecture}
        <div class="card p-6 hover:shadow-md transition-shadow duration-200 {isPast(lecture.date, lecture.time) ? 'opacity-75' : ''}">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Lecture Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{lecture.title}</h3>
                    {#if isToday(lecture.date)}
                      <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">Today</span>
                    {:else if isUpcoming(lecture.date, lecture.time)}
                      <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Upcoming</span>
                    {:else if isPast(lecture.date, lecture.time)}
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Past</span>
                    {/if}
                  </div>
                  
                  <p class="text-primary-600 font-medium mb-1">{lecture.courseName}</p>
                  {#if lecture.description}
                    <p class="text-gray-600 text-sm mb-3">{lecture.description}</p>
                  {/if}
                </div>
              </div>
              
              <!-- Lecture Details -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{formatDate(lecture.date)}</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{formatTime(lecture.time)}</div>
                    <div class="text-xs text-gray-500">{lecture.duration}</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <MapPin class="w-4 h-4 text-gray-400" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{lecture.venue}</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <img 
                    src={lecture.instructorAvatar} 
                    alt={lecture.instructor}
                    class="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{lecture.instructor}</div>
                  </div>
                </div>
              </div>
              
              <!-- Materials and Recording -->
              {#if lecture.materials.length > 0 || lecture.recordingUrl}
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each lecture.materials as material}
                    <a 
                      href={material.url} 
                      class="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download class="w-3 h-3" />
                      <span>{material.title}</span>
                    </a>
                  {/each}
                  
                  {#if lecture.recordingUrl}
                    <a 
                      href={lecture.recordingUrl} 
                      class="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full hover:bg-green-100 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play class="w-3 h-3" />
                      <span>Recording</span>
                    </a>
                  {/if}
                </div>
              {/if}
              
              <!-- Attendance Info -->
              {#if lecture.attendanceCount !== undefined && lecture.totalStudents !== undefined}
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2">
                    <Users class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">
                      Attendance: {lecture.attendanceCount}/{lecture.totalStudents} students
                    </span>
                  </div>
                  <div class="text-gray-500">
                    {Math.round((lecture.attendanceCount / lecture.totalStudents) * 100)}% attendance rate
                  </div>
                </div>
              {/if}
            </div>
            
            <!-- Action Button -->
            <div class="ml-6">
              <a 
                href="#/lectures/{lecture.id}" 
                class="btn btn-primary px-4 py-2"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      {/each}
      
      {#if filteredLectures.length === 0}
        <div class="text-center py-12">
          <Calendar class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No lectures found</h3>
          <p class="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      {/if}
    </div>
  </div>
</Layout>