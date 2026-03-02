// seedDB.js - Database seeding script for School Management System
// Run this script to populate the database with sample data

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import all models
import Admin from "./models/Admin.js";
import Teacher from "./models/Teacher.js";
import Student from "./models/Student.js";
import Class from "./models/Class.js";
import Exam from "./models/Exam.js";
import ExamResult from "./models/ExamResult.js";
import Homework from "./models/Homework.js";
import Notice from "./models/Notice.js";
import Event from "./models/Event.js";
import Holiday from "./models/Holiday.js";
import LeaveRequest from "./models/LeaveRequest.js";
import StudentAttendance from "./models/AttendStudent.js";
import TeacherAttendance from "./models/AttendTeacher.js";
import FeeStructure from "./models/FeeStructure.js";
import Payment from "./models/Payment.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Class.deleteMany({}),
      Exam.deleteMany({}),
      ExamResult.deleteMany({}),
      Homework.deleteMany({}),
      Notice.deleteMany({}),
      Event.deleteMany({}),
      Holiday.deleteMany({}),
      LeaveRequest.deleteMany({}),
      StudentAttendance.deleteMany({}),
      TeacherAttendance.deleteMany({}),
      FeeStructure.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log("🗑️ Cleared existing data");

    // Create Admin
    const adminData = {
      name: "School Admin",
      email: "admin@school.edu",
      password: "admin123",
      domain: "Administration",
    };
    const admin = await Admin.create(adminData);
    console.log("✅ Created Admin:", admin.email);

    // Create Teachers
    const teacherData = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@school.edu",
        password: "teacher123",
        mobile: "9876543210",
        location: "Delhi",
        experience: 10,
        subjects: ["Mathematics", "Physics"],
        createdBy: admin._id,
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@school.edu",
        password: "teacher123",
        mobile: "9876543211",
        location: "Mumbai",
        experience: 8,
        subjects: ["Chemistry", "Biology"],
        createdBy: admin._id,
      },
      {
        name: "Amit Verma",
        email: "amit.verma@school.edu",
        password: "teacher123",
        mobile: "9876543212",
        location: "Delhi",
        experience: 12,
        subjects: ["English", "Hindi"],
        createdBy: admin._id,
      },
      {
        name: "Sonia Gupta",
        email: "sonia.gupta@school.edu",
        password: "teacher123",
        mobile: "9876543213",
        location: "Bangalore",
        experience: 6,
        subjects: ["Computer Science", "Mathematics"],
        createdBy: admin._id,
      },
    ];
    const teachers = await Teacher.insertMany(teacherData.map(teacher => ({
      ...teacher,
      password: bcrypt.hashSync(teacher.password, 10)
    })));
    console.log(`✅ Created ${teachers.length} Teachers`);

    // Create Classes
    const classData = [
      {
        name: "Class 10",
        section: "A",
        grade: "10",
        subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi"],
        capacity: 40,
        room: "Room 101",
        schedule: { startTime: "08:00", endTime: "14:00" },
        createdBy: admin._id,
      },
      {
        name: "Class 10",
        section: "B",
        grade: "10",
        subjects: ["Mathematics", "Physics", "Chemistry", "English", "Hindi"],
        capacity: 40,
        room: "Room 102",
        schedule: { startTime: "08:00", endTime: "14:00" },
        createdBy: admin._id,
      },
      {
        name: "Class 12",
        section: "A",
        grade: "12",
        subjects: ["Mathematics", "Physics", "Chemistry", "English", "Computer Science"],
        capacity: 35,
        room: "Room 201",
        schedule: { startTime: "08:00", endTime: "14:00" },
        createdBy: admin._id,
      },
    ];
    const classes = await Class.insertMany(classData);
    console.log(`✅ Created ${classes.length} Classes`);

    // Create Students
    const studentData = [
      {
        name: "Rahul",
        lastname: "Singh",
        email: "rahul.singh@school.edu",
        password: "student123",
        mobile: "9876543220",
        class: "10",
        section: "A",
        rollNumber: "10A001",
        createdBy: admin._id,
      },
      {
        name: "Priya",
        lastname: "Patel",
        email: "priya.patel@school.edu",
        password: "student123",
        mobile: "9876543221",
        class: "10",
        section: "A",
        rollNumber: "10A002",
        createdBy: admin._id,
      },
      {
        name: "Amit",
        lastname: "Yadav",
        email: "amit.yadav@school.edu",
        password: "student123",
        mobile: "9876543222",
        class: "10",
        section: "A",
        rollNumber: "10A003",
        createdBy: admin._id,
      },
      {
        name: "Sneha",
        lastname: "Reddy",
        email: "sneha.reddy@school.edu",
        password: "student123",
        mobile: "9876543223",
        class: "10",
        section: "A",
        rollNumber: "10A004",
        createdBy: admin._id,
      },
      {
        name: "Vikram",
        lastname: "Malhotra",
        email: "vikram.malhotra@school.edu",
        password: "student123",
        mobile: "9876543224",
        class: "10",
        section: "B",
        rollNumber: "10B001",
        createdBy: admin._id,
      },
      {
        name: "Anjali",
        lastname: "Kapoor",
        email: "anjali.kapoor@school.edu",
        password: "student123",
        mobile: "9876543225",
        class: "12",
        section: "A",
        rollNumber: "12A001",
        createdBy: admin._id,
      },
      {
        name: "Rohan",
        lastname: "Mehra",
        email: "rohan.mehra@school.edu",
        password: "student123",
        mobile: "9876543226",
        class: "12",
        section: "A",
        rollNumber: "12A002",
        createdBy: admin._id,
      },
      {
        name: "Kavya",
        lastname: "Nair",
        email: "kavya.nair@school.edu",
        password: "student123",
        mobile: "9876543227",
        class: "10",
        section: "B",
        rollNumber: "10B002",
        createdBy: admin._id,
      },
    ];
    const students = await Student.insertMany(studentData.map(student => ({
      ...student,
      password: bcrypt.hashSync(student.password, 10)
    })));
    console.log(`✅ Created ${students.length} Students`);

    // Update class students array and assign classTeacher
    const class10A = classes.find(c => c.name === "Class 10" && c.section === "A");
    const class10B = classes.find(c => c.name === "Class 10" && c.section === "B");
    const class12A = classes.find(c => c.name === "Class 12" && c.section === "A");

    if (class10A) {
      const students10A = students.filter(s => s.class === "10" && s.section === "A");
      class10A.students = students10A.map(s => s._id);
      class10A.classTeacher = teachers[0]._id; // Rajesh Kumar (Math/Physics)
      await class10A.save();
    }
    if (class10B) {
      const students10B = students.filter(s => s.class === "10" && s.section === "B");
      class10B.students = students10B.map(s => s._id);
      class10B.classTeacher = teachers[2]._id; // Amit Verma (English/Hindi)
      await class10B.save();
    }
    if (class12A) {
      const students12A = students.filter(s => s.class === "12" && s.section === "A");
      class12A.students = students12A.map(s => s._id);
      class12A.classTeacher = teachers[3]._id; // Sonia Gupta (Computer Science/Math)
      await class12A.save();
    }

    console.log(`✅ Updated classes with students and classTeachers`);

    // Create Holidays
    const holidayData = [
      {
        name: "Republic Day",
        date: new Date("2025-01-26"),
        description: "National Holiday - Celebration of Indian Constitution",
        type: "National",
        createdBy: admin._id,
      },
      {
        name: "Holi",
        date: new Date("2025-03-14"),
        description: "Festival of Colors",
        type: "Religious",
        createdBy: admin._id,
      },
      {
        name: "Good Friday",
        date: new Date("2025-04-18"),
        description: "Christian Holiday",
        type: "Religious",
        createdBy: admin._id,
      },
      {
        name: "Independence Day",
        date: new Date("2025-08-15"),
        description: "National Holiday - Celebration of India's Independence",
        type: "National",
        createdBy: admin._id,
      },
      {
        name: "Diwali",
        date: new Date("2025-10-31"),
        description: "Festival of Lights",
        type: "Religious",
        createdBy: admin._id,
      },
      {
        name: "Christmas",
        date: new Date("2025-12-25"),
        description: "Christmas Day",
        type: "Religious",
        createdBy: admin._id,
      },
    ];
    const holidays = await Holiday.insertMany(holidayData);
    console.log(`✅ Created ${holidays.length} Holidays`);

    // Create Events
    const eventData = [
      {
        title: "Annual Sports Day",
        date: new Date("2025-02-15"),
        description: "Annual sports competition for all students",
        audience: "All",
        isHoliday: false,
        location: "School Ground",
        createdBy: admin._id,
      },
      {
        title: "Science Exhibition",
        date: new Date("2025-03-20"),
        description: "Student science projects exhibition",
        audience: "All",
        isHoliday: false,
        location: "School Auditorium",
        createdBy: admin._id,
      },
      {
        title: "Parent-Teacher Meeting",
        date: new Date("2025-04-05"),
        description: "PTM for all classes",
        audience: "All",
        isHoliday: false,
        location: "School Building",
        createdBy: admin._id,
      },
      {
        title: "Annual Function",
        date: new Date("2025-11-15"),
        description: "School annual day celebration",
        audience: "All",
        isHoliday: false,
        location: "School Auditorium",
        createdBy: admin._id,
      },
    ];
    const events = await Event.insertMany(eventData);
    console.log(`✅ Created ${events.length} Events`);

    // Create Notices
    const noticeData = [
      {
        title: "School Timing Change",
        description: "From Monday, school timing will be 8:00 AM to 3:00 PM",
        audience: "All",
        isImportant: true,
        createdBy: admin._id,
      },
      {
        title: "Exam Schedule Released",
        description: "Final exam schedule for Classes 10 and 12 has been released",
        audience: "All",
        isImportant: true,
        createdBy: admin._id,
      },
      {
        title: "Uniform Guidelines",
        description: "Students must wear proper school uniform daily",
        audience: "Students",
        isImportant: false,
        createdBy: admin._id,
      },
      {
        title: "Staff Meeting",
        description: "All teachers must attend the staff meeting on Friday",
        audience: "Teachers",
        isImportant: true,
        createdBy: admin._id,
      },
    ];
    const notices = await Notice.insertMany(noticeData);
    console.log(`✅ Created ${notices.length} Notices`);

    // Create Homework
    const homeworkData = [
      {
        title: "Math Chapter 5 Exercises",
        description: "Complete all exercises from Chapter 5 (Polynomials)",
        assignedBy: teachers[0]._id,
        assignedTo: students.filter(s => s.class === "10").map(s => s._id),
        dueDate: new Date("2025-01-30"),
        subject: "Mathematics",
        classSection: "10A",
        createdBy: admin._id,
      },
      {
        title: "Physics Lab Report",
        description: "Write lab report for the Ohm's Law experiment",
        assignedBy: teachers[0]._id,
        assignedTo: students.filter(s => s.class === "10").map(s => s._id),
        dueDate: new Date("2025-02-05"),
        subject: "Physics",
        classSection: "10A",
        createdBy: admin._id,
      },
      {
        title: "Chemistry NCERT Questions",
        description: "Solve all in-text questions from Chapter 3",
        assignedBy: teachers[1]._id,
        assignedTo: students.filter(s => s.class === "10").map(s => s._id),
        dueDate: new Date("2025-02-10"),
        subject: "Chemistry",
        classSection: "10A",
        createdBy: admin._id,
      },
      {
        title: "English Essay Writing",
        description: "Write an essay on 'My Dream Career' (500 words)",
        assignedBy: teachers[2]._id,
        assignedTo: students.filter(s => s.class === "10").map(s => s._id),
        dueDate: new Date("2025-02-15"),
        subject: "English",
        classSection: "10A",
        createdBy: admin._id,
      },
    ];
    const homeworks = await Homework.insertMany(homeworkData);
    console.log(`✅ Created ${homeworks.length} Homeworks`);

    // Create Exams
    const examData = [
      {
        teacher: teachers[0]._id,
        subjectName: "Mathematics",
        examDate: new Date("2025-02-10"),
        examDay: "Monday",
        totalMarks: 100,
        class: "10",
        section: "A",
        createdBy: admin._id,
      },
      {
        teacher: teachers[0]._id,
        subjectName: "Physics",
        examDate: new Date("2025-02-12"),
        examDay: "Wednesday",
        totalMarks: 100,
        class: "10",
        section: "A",
        createdBy: admin._id,
      },
      {
        teacher: teachers[1]._id,
        subjectName: "Chemistry",
        examDate: new Date("2025-02-14"),
        examDay: "Friday",
        totalMarks: 100,
        class: "10",
        section: "A",
        createdBy: admin._id,
      },
      {
        teacher: teachers[3]._id,
        subjectName: "Computer Science",
        examDate: new Date("2025-02-17"),
        examDay: "Monday",
        totalMarks: 100,
        class: "12",
        section: "A",
        createdBy: admin._id,
      },
    ];
    const exams = await Exam.insertMany(examData);
    console.log(`✅ Created ${exams.length} Exams`);

    // Create Exam Results
    const examResultData = [];
    const students10A = students.filter(s => s.class === "10" && s.section === "A");
    
    exams.forEach((exam, examIndex) => {
      if (exam.subjectName === "Mathematics" || exam.subjectName === "Physics" || exam.subjectName === "Chemistry") {
        students10A.forEach((student, studentIndex) => {
          const marks = Math.floor(Math.random() * 40) + 60; // 60-100 marks
          let grade = "F";
          if (marks >= 90) grade = "A+";
          else if (marks >= 80) grade = "A";
          else if (marks >= 70) grade = "B+";
          else if (marks >= 60) grade = "B";
          else if (marks >= 50) grade = "C";
          else if (marks >= 40) grade = "D";
          
          examResultData.push({
            exam: exam._id,
            examName: `${exam.subjectName} Exam`,
            student: student._id,
            subject: exam.subjectName,
            class: exam.class,
            section: exam.section,
            marksObtained: marks,
            totalMarks: exam.totalMarks,
            grade: grade,
            teacher: exam.teacher,
            createdBy: admin._id,
          });
        });
      }
    });
    
    const examResults = await ExamResult.insertMany(examResultData);
    console.log(`✅ Created ${examResults.length} Exam Results`);

    // Create Student Attendance
    const studentAttendanceData = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      students.forEach((student) => {
        const random = Math.random();
        let status = "Present";
        if (random > 0.9) status = "Absent";
        else if (random > 0.85) status = "Leave";
        
        studentAttendanceData.push({
          student: student._id,
          date: date,
          status: status,
          remarks: status === "Absent" ? "Unauthorized absence" : "",
          markedBy: admin._id,
        });
      });
    }
    const studentAttendances = await StudentAttendance.insertMany(studentAttendanceData);
    console.log(`✅ Created ${studentAttendances.length} Student Attendance Records`);

    // Create Teacher Attendance
    const teacherAttendanceData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      teachers.forEach((teacher) => {
        const random = Math.random();
        let status = "Present";
        if (random > 0.95) status = "Absent";
        else if (random > 0.9) status = "Leave";
        
        teacherAttendanceData.push({
          teacher: teacher._id,
          date: date,
          status: status,
          remarks: status === "Leave" ? "Personal leave" : "",
          markedBy: admin._id,
        });
      });
    }
    const teacherAttendances = await TeacherAttendance.insertMany(teacherAttendanceData);
    console.log(`✅ Created ${teacherAttendances.length} Teacher Attendance Records`);

    // Create Leave Requests
    const leaveRequestData = [
      {
        requester: students[0]._id,
        admin: admin._id,
        reason: "Medical leave - Fever",
        fromDate: new Date("2025-01-20"),
        toDate: new Date("2025-01-22"),
        status: "Approved",
        createdBy: admin._id,
      },
      {
        requester: students[1]._id,
        admin: admin._id,
        reason: "Family function",
        fromDate: new Date("2025-02-05"),
        toDate: new Date("2025-02-06"),
        status: "Pending",
        createdBy: admin._id,
      },
      {
        requester: teachers[0]._id,
        admin: admin._id,
        reason: "Medical emergency",
        fromDate: new Date("2025-02-01"),
        toDate: new Date("2025-02-03"),
        status: "Approved",
        createdBy: admin._id,
      },
    ];
    const leaveRequests = await LeaveRequest.insertMany(leaveRequestData);
    console.log(`✅ Created ${leaveRequests.length} Leave Requests`);

    // Create Fee Structures
    const feeStructureData = [
      {
        class: "10",
        section: "A",
        academicYear: "2024-2025",
        fees: {
          tuition: 15000,
          transport: 3000,
          library: 1000,
          sports: 2000,
          exam: 1500,
          other: 500
        },
        totalAmount: 23000,
        dueDate: new Date("2025-03-31"),
        createdBy: admin._id,
      },
      {
        class: "10",
        section: "B",
        academicYear: "2024-2025",
        fees: {
          tuition: 15000,
          transport: 3000,
          library: 1000,
          sports: 2000,
          exam: 1500,
          other: 500
        },
        totalAmount: 23000,
        dueDate: new Date("2025-03-31"),
        createdBy: admin._id,
      },
      {
        class: "12",
        section: "A",
        academicYear: "2024-2025",
        fees: {
          tuition: 18000,
          transport: 3500,
          library: 1200,
          sports: 2500,
          exam: 2000,
          other: 800
        },
        totalAmount: 28000,
        dueDate: new Date("2025-03-31"),
        createdBy: admin._id,
      },
    ];
    const feeStructures = await FeeStructure.insertMany(feeStructureData);
    console.log(`✅ Created ${feeStructures.length} Fee Structures`);

    // Create Payments
    const paymentData = [];
    students.forEach((student, index) => {
      const feeStructure = feeStructures.find(
        f => f.class === student.class && f.section === student.section
      );
      
      if (feeStructure && index % 2 === 0) {
        paymentData.push({
          student: student._id,
          feeStructure: feeStructure._id,
          amount: feeStructure.totalAmount,
          paymentMethod: ["Cash", "Online", "Card"][index % 3],
          transactionId: `TXN${Date.now()}${index}`,
          paymentDate: new Date("2025-01-15"),
          status: "Completed",
          receiptNumber: `REC2025${String(index + 1).padStart(4, '0')}`,
          remarks: "Full payment",
          collectedBy: admin._id,
        });
      } else if (feeStructure && index % 3 === 0) {
        paymentData.push({
          student: student._id,
          feeStructure: feeStructure._id,
          amount: feeStructure.totalAmount / 2,
          paymentMethod: "Cash",
          paymentDate: new Date("2025-01-10"),
          status: "Completed",
          receiptNumber: `REC2025${String(index + 1).padStart(4, '0')}`,
          remarks: "Partial payment",
          collectedBy: admin._id,
        });
      }
    });
    const payments = await Payment.insertMany(paymentData);
    console.log(`✅ Created ${payments.length} Payments`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📋 Sample Login Credentials:");
    console.log("   Admin: admin@school.edu / admin123");
    console.log("   Teachers: teacher123 (password for all)");
    console.log("   Students: student123 (password for all)");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

export default seedDatabase;

// Run the seeder if this file is executed directly
seedDatabase();
