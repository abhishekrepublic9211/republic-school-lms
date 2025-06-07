import Dashboard from './pages/Dashboard.svelte';
import Profile from './pages/Profile.svelte';
import Courses from './pages/Courses.svelte';
import CourseDetail from './pages/CourseDetail.svelte';
import Assignments from './pages/Assignments.svelte';
import Calendar from './pages/Calendar.svelte';
import Chat from './pages/Chat.svelte';
import Doubts from './pages/Doubts.svelte';
import Settings from './pages/Settings.svelte';
import Payments from './pages/Payments.svelte';
import Lectures from './pages/Lectures.svelte';
import LectureDetail from './pages/LectureDetail.svelte';
import Attendance from './pages/Attendance.svelte';
import Grades from './pages/Grades.svelte';
import Feedback from './pages/Feedback.svelte';
import Login from './pages/Login.svelte';

export const routes = {
  '/': Login,
  '/login': Login,
  '/dashboard': Dashboard,
  '/profile': Profile,
  '/courses': Courses,
  '/courses/:id': CourseDetail,
  '/assignments': Assignments,
  '/calendar': Calendar,
  '/chat': Chat,
  '/doubts': Doubts,
  '/settings': Settings,
  '/payments': Payments,
  '/lectures': Lectures,
  '/lectures/:id': LectureDetail,
  '/attendance': Attendance,
  '/grades': Grades,
  '/feedback': Feedback,
};