<script lang="ts">
  import { Calendar, Clock, Users, MapPin, Play, Download, MessageCircle } from 'lucide-svelte';
  import { lectures } from '$lib/stores/lectures';
  import { attendanceRecords } from '$lib/stores/attendance';
  import { currentUser } from '$lib/stores/auth';

  let selectedDate = '';
  let selectedCourse = '';

  // Filter lectures
  $: filteredLectures = $lectures.filter(lecture => {
    const matchesDate = !selectedDate || lecture.date === selectedDate;
    const matchesCourse = !selectedCourse || lecture.courseId === selectedCourse;
    return matchesDate && matchesCourse;
  });

  // Get unique courses for filter
  $: uniqueCourses = [...new Set($lectures.map(l => ({ id: l.courseId, name: l.courseName })))];

  // Get today's lectures
  $: todaysLectures = $lectures.filter(lecture => {
    const today = new Date().toISOString().split('T')[0];
    return lecture.date === today;
  });

  // Get upcoming lectures
  $: upcomingLectures = $lectures.filter(lecture => {
    const lectureDate = new Date(lecture.date);
    const today = new Date();
    return lectureDate > today;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get past lectures
  $: pastLectures = $lectures.filter(lecture => {
    const lectureDate = new Date(lecture.date);
    const today = new Date();
    return lectureDate < today;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function getAttendanceStatus(lectureId: string): string {
    const record = $attendanceRecords.find(r => r.lectureId === lectureId && r.studentId === $currentUser?.id);
    return record?.status || 'not-marked';
  }

  function joinLecture(lectureId: string) {
    console.log('Joining lecture:', lectureId);
  }

  function downloadMaterial(materialUrl: string) {
    console.log('Downloading material:', materialUrl);
  }

  function openDiscussion(forumId: string) {
    console.log('Opening discussion:', forumId);
  }

  function watchRecording(recordingUrl: string) {
    console.log('Watching recording:', recordingUrl);
  }
</script>

<svelte:head>
  <title>Lectures - Republic School of Journalism</title>
</svelte:head>

<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Lectures</h1>
      <p class="text-gray-600 mt-1">Attend live sessions and access recordings</p>
    </div>
    
    <!-- Filters -->
    <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
      <input
        type="date"
        bind:value={selectedDate}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      
      <select
        bind:value={selectedCourse}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Courses</option>
        {#each uniqueCourses as course}
          <option value={course.id}>{course.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Today's Lectures -->
  {#if todaysLectures.length > 0}
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Today's Lectures</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each todaysLectures as lecture}
          <div class="card p-6 border-l-4 border-primary-500">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                <p class="text-sm text-gray-600 mb-2">{lecture.courseName}</p>
                <p class="text-sm text-gray-500">{lecture.description}</p>
              </div>
              <span class="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                Today
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-2">
                <Clock class="w-4 h-4" />
                <span>{lecture.time} ({lecture.duration})</span>
              </div>
              <div class="flex items-center space-x-2">
                <MapPin class="w-4 h-4" />
                <span>{lecture.venue}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Users class="w-4 h-4" />
                <span>{lecture.instructor}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Users class="w-4 h-4" />
                <span>{lecture.attendanceCount}/{lecture.totalStudents} attended</span>
              </div>
            </div>
            
            <button 
              on:click={() => joinLecture(lecture.id)}
              class="w-full btn btn-primary"
            >
              Join Lecture
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Upcoming Lectures -->
  {#if upcomingLectures.length > 0}
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Upcoming Lectures</h2>
      <div class="space-y-4">
        {#each upcomingLectures as lecture}
          <div class="card p-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div class="flex-1">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                    <p class="text-sm text-gray-600 mb-2">{lecture.courseName}</p>
                    <p class="text-sm text-gray-500">{lecture.description}</p>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full ml-4">
                    Upcoming
                  </span>
                </div>
                
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-2">
                    <Calendar class="w-4 h-4" />
                    <span>{new Date(lecture.date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Clock class="w-4 h-4" />
                    <span>{lecture.time} ({lecture.duration})</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <MapPin class="w-4 h-4" />
                    <span>{lecture.venue}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Users class="w-4 h-4" />
                    <span>{lecture.instructor}</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 lg:mt-0 lg:ml-6">
                <button class="btn btn-secondary">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Past Lectures -->
  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Past Lectures</h2>
    <div class="space-y-4">
      {#each pastLectures as lecture}
        <div class="card p-6">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{lecture.title}</h3>
                  <p class="text-sm text-gray-600 mb-2">{lecture.courseName}</p>
                  <p class="text-sm text-gray-500">{lecture.description}</p>
                </div>
                
                <div class="flex flex-col items-end space-y-2 ml-4">
                  <span class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    Completed
                  </span>
                  {#if getAttendanceStatus(lecture.id) === 'present'}
                    <span class="px-2 py-1 text-xs font-medium bg-success-100 text-success-700 rounded-full">
                      Attended
                    </span>
                  {:else if getAttendanceStatus(lecture.id) === 'absent'}
                    <span class="px-2 py-1 text-xs font-medium bg-error-100 text-error-700 rounded-full">
                      Absent
                    </span>
                  {/if}
                </div>
              </div>
              
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4" />
                  <span>{new Date(lecture.date).toLocaleDateString()}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4" />
                  <span>{lecture.time} ({lecture.duration})</span>
                </div>
                <div class="flex items-center space-x-2">
                  <MapPin class="w-4 h-4" />
                  <span>{lecture.venue}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Users class="w-4 h-4" />
                  <span>{lecture.instructor}</span>
                </div>
              </div>
              
              <!-- Materials -->
              {#if lecture.materials.length > 0}
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Materials</h4>
                  <div class="flex flex-wrap gap-2">
                    {#each lecture.materials as material}
                      <button 
                        on:click={() => downloadMaterial(material.url)}
                        class="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                      >
                        <Download class="w-3 h-3" />
                        <span>{material.title}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
            
            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
              {#if lecture.recordingUrl}
                <button 
                  on:click={() => watchRecording(lecture.recordingUrl)}
                  class="btn btn-primary flex items-center space-x-2"
                >
                  <Play class="w-4 h-4" />
                  <span>Watch Recording</span>
                </button>
              {/if}
              
              {#if lecture.discussionForumId}
                <button 
                  on:click={() => openDiscussion(lecture.discussionForumId)}
                  class="btn btn-secondary flex items-center space-x-2"
                >
                  <MessageCircle class="w-4 h-4" />
                  <span>Discussion</span>
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>