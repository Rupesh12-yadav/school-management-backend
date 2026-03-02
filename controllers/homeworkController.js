import Homework from "../models/Homework.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";

// Create Homework
export const createHomework = async (req, res) => {
  try {
    // Frontend se data le rahe hain
    const { title, description, dueDate, subject, section, assignedTo } = req.body;
    // Class field kabhi 'class' ya 'classGrade' ke naam se aa sakta hai
    const classGrade = req.body.class || req.body.classGrade;

    if (!title || !dueDate || !subject || !classGrade || !section) {
      return res.status(400).json({ message: "Please provide title, date, subject, class, and section" });
    }

    // Students ko find karna
    let studentIds = [];
    if (assignedTo && Array.isArray(assignedTo) && assignedTo.length > 0) {
      // Agar specific students select kiye gaye hain
      studentIds = assignedTo;
    } else {
      // Agar poori class ko assign karna hai
      const students = await Student.find({ class: classGrade, section: section });
      studentIds = students.map(s => s._id);
    }

    const newHomework = new Homework({
      title,
      description,
      dueDate,
      subject,
      classSection: `${classGrade} ${section}`,
      assignedBy: req.user._id,
      assignedTo: studentIds,
      createdBy: req.user._id
    });

    const savedHomework = await newHomework.save();

    // Teacher ke record mein update karna
    if (req.user.role === "Teacher") {
      await Teacher.findByIdAndUpdate(req.user._id, {
        $push: { homeworkCreated: savedHomework._id }
      });
    }

    // Students ke record mein update karna
    if (studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $push: { homework: savedHomework._id } }
      );
    }

    res.status(201).json({ message: "Homework created successfully", homework: savedHomework });
  } catch (error) {
    console.error("Create Homework Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Homework (Role based filtering)
export const getAllHomework = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    if (role === "Student") {
      // Students sirf apna homework dekh sakte hain
      query = { assignedTo: _id };
    } else if (role === "Teacher") {
      // Teachers apna create kiya hua homework dekh sakte hain
      query = { assignedBy: _id };
    } else if (role === "Admin") {
      // Admin sab kuch dekh sakta hai - all homework
      query = {};
    }

    const homeworks = await Homework.find(query)
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(homeworks);
  } catch (error) {
    console.error("Get Homework Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Homework by ID
export const getHomeworkById = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id)
      .populate("assignedBy", "name")
      .populate("assignedTo", "name rollNumber");
      
    if (!homework) return res.status(404).json({ message: "Homework not found" });
    res.status(200).json(homework);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Homework
export const updateHomework = async (req, res) => {
  try {
    const updatedHomework = await Homework.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedHomework) return res.status(404).json({ message: "Homework not found" });
    res.status(200).json(updatedHomework);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Homework
export const deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id);
    if (!homework) return res.status(404).json({ message: "Homework not found" });

    await Homework.findByIdAndDelete(req.params.id);
    
    // Cleanup references
    await Student.updateMany(
      { homework: req.params.id },
      { $pull: { homework: req.params.id } }
    );
    
    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper: Get Teacher Subjects
export const getTeacherSubjects = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        
        // Get teacher's assigned subjects
        let teacherSubjects = teacher.subjects || [];
        
        // If teacher has no subjects assigned, get subjects from all classes
        if (teacherSubjects.length === 0) {
            const allClasses = await Class.find({}, { subjects: 1 });
            const allSubjects = allClasses.flatMap(c => c.subjects || []);
            teacherSubjects = [...new Set(allSubjects)];
        }
        
        res.status(200).json(teacherSubjects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Helper: Get Available Classes
export const getAvailableClasses = async (req, res) => {
    try {
        const classes = await Class.find({}, { name: 1, section: 1, grade: 1 }).lean();
        
        // Format classes with label for frontend
        const formattedClasses = classes.map(cls => ({
            _id: cls._id,
            name: cls.name,
            section: cls.section,
            grade: cls.grade,
            label: `${cls.name}${cls.section ? '-' + cls.section : ''}`
        }));
        
        res.status(200).json(formattedClasses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};