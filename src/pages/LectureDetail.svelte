<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Play, 
    Download, 
    CheckCircle, 
    MessageCircle,
    FileText,
    Video
  } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { lectures, selectedLecture } from '../stores/lectures';
  import { attendanceRecords } from '../stores/attendance';
  import { currentUser } from '../stores/auth';

  export let params: { id: string };

  let hasCheckedIn = false;
  let checkInTime = '';

  onMount(() => {
    const lecture = $lectures.find(l => l.id === params.id);
    if (lecture) {
      selectedLecture.set(lecture);
      
      // Check if user has already checked in
      const userAttendance = $attendanceRecords.find(record => 
        record.lectureId === params.id && record.studentId === $currentUser?.id
      );
      
      if (userAttendance && userAttendance.status === 'present') {
        hasCheckedIn = true;
        checkInTime = userAttendance.timestamp || '';
      }
    }
  });

  function handleCheckIn() {
    if (!$selectedLecture || !$currentUser || hasCheckedIn) return;
    
    const timestamp = new Date().toISOString();
    const newRecord = {
      id: Date.now().toString(),
      lectureId: $selectedLecture.id,
      studentId: $currentUser.id,
      studentName: $currentUser.name,
      status: 'present' as const,
      timestamp,
      checkInMethod: 'qr' as const
    };
    
    attendanceRecords.update(records => [...records, newRecord]);
    hasCheckedIn = true;
    checkInTime = timestamp;
    
    // Update lecture attendance count
    lectures.update(lectureList => 
      lectureList.map(lecture => 
        lecture.id === $selectedLecture.id 
          ? { ...lecture, attendanceCount: (lecture.attendanceCount || 0) + 1 }
          : lecture
      )
    );
  }

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

  function isLectureToday(): boolean {
    if (!$selectedLecture) return false;
    const lectureDate = new Date($selectedLecture.date);
    const today = new Date();
    return lectureDate.toDateString() === today.toDateString();
  }

  function isLectureTime(): boolean {
    if (!$selectedLecture) return false;
    const now = new Date();
    const lectureStart = new Date(`${$selectedLecture.date}T${$selectedLecture.time}`);
    const lectureEnd = new Date(lectureStart.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hour duration
    
    return now >= lectureStart && now <= lectureEnd;
  }

  function getResourceIcon(type: string) {
    switch (type) {
      case 'video':
        return Video;
      case 'slides':
        return FileText;
      default:
        return Download;
    }
  }
</script>

<Layout>
  {#if $selectedLecture}
    <div class="p-6 max-w-4xl mx-auto space-y-6">
      <!-- Lecture Header -->
      <div class="card p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-3">
              <span class="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-700">
                {$selectedLecture.courseName}
              </span>
              {#if isLectureToday()}
                <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                  Today
                </span>
              {/if}
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{$selectedLecture.title}</h1>
            {#if $selectedLecture.description}
              <p class="text-lg text-gray-600 mb-6">{$selectedLecture.description}</p>
            {/if}
            
            <!-- Lecture Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">Date</p>
                  <p class="font-semibold text-gray-900">{formatDate($selectedLecture.date)}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">Time</p>
                  <p class="font-semibold text-gray-900">{formatTime($selectedLecture.time)}</p>
                  <p class="text-xs text-gray-500">{$selectedLecture.duration}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">Venue</p>
                  <p class="font-semibold text-gray-900">{$selectedLecture.venue}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <img 
                  src={$selectedLecture.instructorAvatar} 
                  alt={$selectedLecture.instructor}
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="text-sm text-gray-600">Instructor</p>
                  <p class="font-semibold text-gray-900">{$selectedLecture.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Attendance Section -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>
          
          {#if hasCheckedIn}
            <div class="flex items-center space-x-3 p-4 bg-success-50 border border-success-200 rounded-lg">
              <CheckCircle class="w-6 h-6 text-success-600" />
              <div>
                <p class="font-medium text-success-900">You're checked in!</p>
                <p class="text-sm text-success-700">
                  Checked in at {new Date(checkInTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          {:else if isLectureToday() && isLectureTime()}
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-blue-900">Lecture is in session</p>
                  <p class="text-sm text-blue-700">Click to check in and mark your attendance</p>
                </div>
                <button 
                  class="btn btn-primary"
                  on:click={handleCheckIn}
                >
                  Check In
                </button>
              </div>
            </div>
          {:else if isLectureToday()}
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="font-medium text-yellow-900">Lecture scheduled for today</p>
              <p class="text-sm text-yellow-700">Check-in will be available during lecture time</p>
            </div>
          {:else}
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p class="font-medium text-gray-900">Attendance tracking not available</p>
              <p class="text-sm text-gray-600">Check-in is only available on the day of the lecture</p>
            </div>
          {/if}
          
          {#if $selectedLecture.attendanceCount !== undefined && $selectedLecture.totalStudents !== undefined}
            <div class="mt-4 flex items-center justify-between text-sm">
              <div class="flex items-center space-x-2">
                <Users class="w-4 h-4 text-gray-400" />
                <span class="text-gray-600">
                  Current attendance: {$selectedLecture.attendanceCount}/{$selectedLecture.totalStudents} students
                </span>
              </div>
              <span class="font-medium text-gray-900">
                {Math.round(($selectedLecture.attendanceCount / $selectedLecture.totalStudents) * 100)}%
              </span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Lecture Materials -->
      {#if $selectedLecture.materials.length > 0}
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Lecture Materials</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each $selectedLecture.materials as material}
              <a 
                href={material.url} 
                class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svelte:component this={getResourceIcon(material.type)} class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{material.title}</p>
                  <p class="text-sm text-gray-600 capitalize">{material.type}</p>
                  {#if material.size}
                    <p class="text-xs text-gray-500">{material.size}</p>
                  {/if}
                </div>
                <Download class="w-4 h-4 text-gray-400" />
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Recording -->
      {#if $selectedLecture.recordingUrl}
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Lecture Recording</h3>
          <a 
            href={$selectedLecture.recordingUrl} 
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play class="w-6 h-6 text-green-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Watch Lecture Recording</p>
              <p class="text-sm text-gray-600">Full lecture video available</p>
            </div>
          </a>
        </div>
      {/if}

      <!-- Discussion Forum -->
      {#if $selectedLecture.discussionForumId}
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Discussion Forum</h3>
          <div class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle class="w-5 h-5 text-purple-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Join the discussion</p>
              <p class="text-sm text-gray-600">Ask questions and discuss lecture topics</p>
            </div>
            <a 
              href="#/chat" 
              class="btn btn-primary"
            >
              Join Discussion
            </a>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="p-6">
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Lecture not found</h2>
        <p class="text-gray-600 mb-4">The lecture you're looking for doesn't exist.</p>
        <a href="#/lectures" class="btn btn-primary">Back to Lectures</a>
      </div>
    </div>
  {/if}
</Layout>