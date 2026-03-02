// Combined Attendance Controller - Student & Teacher
import { 
  addStudentAttendance, 
  getStudentAttendance as getStudentAttendanceById,
  getAllStudentsAttendance,
  updateStudentAttendance,
  deleteStudentAttendance
} from './AttenStudentContller.js';

import { 
  addTeacherAttendance,
  getTeacherAttendance as getTeacherAttendanceById,
  getAllTeachersAttendance,
  updateTeacherAttendance,
  deleteTeacherAttendance
} from './AttendTeacherContller.js';

// Student Attendance Exports
export const markStudentAttendance = addStudentAttendance;
export const getStudentAttendance = getAllStudentsAttendance;
export { updateStudentAttendance, deleteStudentAttendance };

// Teacher Attendance Exports
export const markTeacherAttendance = addTeacherAttendance;
export const getTeacherAttendance = getAllTeachersAttendance;
export { updateTeacherAttendance, deleteTeacherAttendance };
