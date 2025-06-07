<script lang="ts">
  import { Search, Filter, Star, Users, Clock, BookOpen, Play, CheckCircle, Calendar } from 'lucide-svelte';
  import Layout from '../components/Layout.svelte';
  import { courses } from '../stores/courses';
  import { currentUser } from '../stores/auth';

  let searchQuery = '';
  let selectedSemester = 'All';
  let selectedYear = 'All';
  let selectedStatus = 'All';
  let sortBy = 'semester';

  // Get program information from current user
  $: programInfo = {
    name: 'Diploma in Journalism',
    department: $currentUser?.department || 'Journalism',
    totalCredits: 120,
    completedCredits: 45,
    currentSemester: $currentUser?.semester || 'Spring',
    academicYear: $currentUser?.academicYear || '2024'
  };

  const semesters = ['All', 'Spring', 'Summer', 'Fall', 'Winter'];
  const years = ['All', '2024', '2023', '2022'];
  const statuses = ['All', 'Current', 'Completed', 'Upcoming', 'Not Started'];

  // Filter courses based on program enrollment
  $: programCourses = $courses.map(course => ({
    ...course,
    status: course.isEnrolled 
      ? (course.progress === 100 ? 'Completed' : 'Current')
      : course.semester === programInfo.currentSemester && course.academicYear === programInfo.academicYear
        ? 'Current'
        : 'Upcoming'
  }));

  $: filteredCourses = programCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;
    const matchesYear = selectedYear === 'All' || course.academicYear === selectedYear;
    const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus;
    
    return matchesSearch && matchesSemester && matchesYear && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'semester':
        return a.semester.localeCompare(b.semester);
      case 'year':
        return a.academicYear.localeCompare(b.academicYear);
      case 'code':
        return a.courseCode.localeCompare(b.courseCode);
      case 'progress':
        return (b.progress || 0) - (a.progress || 0);
      default:
        return 0;
    }
  });

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Current':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-success-100 text-success-700';
      case 'Upcoming':
        return 'bg-warning-100 text-warning-700';
      case 'Not Started':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function getYearLevel(courseCode: string): string {
    const level = courseCode.match(/\d/)?.[0];
    switch (level) {
      case '1': return 'First Year';
      case '2': return 'Second Year';
      case '3': return 'Third Year';
      case '4': return 'Fourth Year';
      default: return 'Foundation';
    }
  }

  // Group courses by year level
  $: coursesByYear = filteredCourses.reduce((acc, course) => {
    const year = getYearLevel(course.courseCode);
    if (!acc[year]) acc[year] = [];
    acc[year].push(course);
    return acc;
  }, {} as Record<string, typeof filteredCourses>);
</script>

<Layout>
  <div class="p-6 space-y-6">
    <!-- Program Header -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 class="text-3xl font-bold mb-2">{programInfo.name}</h1>
          <p class="text-primary-100 mb-3">Department of {programInfo.department}</p>
          <div class="flex flex-wrap gap-4 text-sm">
            <div class="flex items-center space-x-2">
              <BookOpen class="w-4 h-4" />
              <span>Current: {programInfo.currentSemester} {programInfo.academicYear}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Calendar class="w-4 h-4" />
              <span>Student ID: {$currentUser?.studentId}</span>
            </div>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-3xl font-bold mb-1">{programInfo.completedCredits}/{programInfo.totalCredits}</div>
          <div class="text-primary-100 text-sm">Credits Completed</div>
          <div class="w-32 bg-primary-500 rounded-full h-2 mt-2">
            <div 
              class="bg-white h-2 rounded-full transition-all duration-300"
              style="width: {(programInfo.completedCredits / programInfo.totalCredits) * 100}%"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6 text-center">
        <div class="text-2xl font-bold text-blue-600 mb-2">
          {programCourses.filter(c => c.status === 'Current').length}
        </div>
        <div class="text-sm text-gray-600">Current Courses</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="text-2xl font-bold text-success-600 mb-2">
          {programCourses.filter(c => c.status === 'Completed').length}
        </div>
        <div class="text-sm text-gray-600">Completed Courses</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="text-2xl font-bold text-warning-600 mb-2">
          {programCourses.filter(c => c.status === 'Upcoming').length}
        </div>
        <div class="text-sm text-gray-600">Upcoming Courses</div>
      </div>
      
      <div class="card p-6 text-center">
        <div class="text-2xl font-bold text-primary-600 mb-2">
          {Math.round((programInfo.completedCredits / programInfo.totalCredits) * 100)}%
        </div>
        <div class="text-sm text-gray-600">Program Progress</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              bind:value={searchQuery}
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Semester Filter -->
        <div>
          <select 
            bind:value={selectedSemester}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each semesters as semester}
              <option value={semester}>{semester === 'All' ? 'All Semesters' : semester}</option>
            {/each}
          </select>
        </div>

        <!-- Year Filter -->
        <div>
          <select 
            bind:value={selectedYear}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each years as year}
              <option value={year}>{year === 'All' ? 'All Years' : year}</option>
            {/each}
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <select 
            bind:value={selectedStatus}
            class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {#each statuses as status}
              <option value={status}>{status === 'All' ? 'All Status' : status}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Course Curriculum by Year Level -->
    {#each Object.entries(coursesByYear) as [yearLevel, yearCourses]}
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{yearLevel} Courses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {#each yearCourses as course}
            <div class="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
              <!-- Course Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      {course.courseCode}
                    </span>
                    <span class="px-2 py-1 text-xs rounded-full font-medium {getStatusColor(course.status)}">
                      {course.status}
                    </span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-2 text-base md:text-lg leading-tight">{course.title}</h3>
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2 md:line-clamp-3">{course.description}</p>
                </div>
              </div>
              
              <!-- Course Details -->
              <div class="space-y-2 mb-4 flex-grow">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Instructor:</span>
                  <span class="font-medium text-gray-900 text-right max-w-32 truncate">{course.instructor}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Credits:</span>
                  <span class="font-medium text-gray-900">{course.credits}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Semester:</span>
                  <span class="font-medium text-gray-900">{course.semester} {course.academicYear}</span>
                </div>
                {#if course.schedule}
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Schedule:</span>
                    <span class="font-medium text-gray-900 text-right max-w-32 truncate">{course.schedule.days.join(', ')}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Time:</span>
                    <span class="font-medium text-gray-900">{course.schedule.time}</span>
                  </div>
                {/if}
              </div>
              
              <!-- Progress Bar (for enrolled courses) -->
              {#if course.isEnrolled && course.progress !== undefined}
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-gray-600">Progress</span>
                    <span class="text-sm font-medium text-primary-600">{course.progress}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style="width: {course.progress}%"
                    ></div>
                  </div>
                </div>
              {/if}
              
              <!-- Action Button - Always at bottom -->
              <div class="flex space-x-2 mt-auto">
                {#if course.status === 'Current'}
                  <a href="#/courses/{course.id}" class="flex-1 btn btn-primary text-sm py-2.5 flex items-center justify-center space-x-2">
                    <Play class="w-4 h-4" />
                    <span>Continue</span>
                  </a>
                {:else if course.status === 'Completed'}
                  <a href="#/courses/{course.id}" class="flex-1 btn btn-secondary text-sm py-2.5 flex items-center justify-center space-x-2">
                    <CheckCircle class="w-4 h-4" />
                    <span>Review</span>
                  </a>
                {:else if course.status === 'Upcoming'}
                  <button class="flex-1 btn btn-secondary text-sm py-2.5 opacity-60 cursor-not-allowed">
                    Starts {course.semester} {course.academicYear}
                  </button>
                {:else}
                  <a href="#/courses/{course.id}" class="flex-1 btn btn-secondary text-sm py-2.5">
                    View Details
                  </a>
                {/if}
              </div>
              
              <!-- Prerequisites (if any) -->
              {#if course.syllabus && course.syllabus.length > 0}
                <div class="mt-4 pt-3 border-t border-gray-100">
                  <p class="text-xs text-gray-500 mb-1">Course Topics:</p>
                  <div class="flex flex-wrap gap-1">
                    {#each course.syllabus.slice(0, 3) as topic}
                      <span class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                        {topic}
                      </span>
                    {/each}
                    {#if course.syllabus.length > 3}
                      <span class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                        +{course.syllabus.length - 3} more
                      </span>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}

    {#if filteredCourses.length === 0}
      <div class="text-center py-12">
        <BookOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>
    {/if}

    <!-- Program Requirements -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Program Requirements</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 mb-2">120</div>
          <div class="text-sm text-gray-600">Total Credits Required</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 mb-2">90</div>
          <div class="text-sm text-gray-600">Core Course Credits</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 mb-2">30</div>
          <div class="text-sm text-gray-600">Elective Credits</div>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="font-medium text-blue-900 mb-2">Graduation Requirements</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• Complete all 120 credit hours with minimum 2.0 GPA</li>
          <li>• Complete all core journalism courses</li>
          <li>• Complete capstone project or internship</li>
          <li>• Maintain 75% attendance in all courses</li>
        </ul>
      </div>
    </div>
  </div>
</Layout>