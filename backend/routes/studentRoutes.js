import express from 'express'
import asyncHandler from 'express-async-handler'
import Student from '../models/studentModel.js'
import capitalize from '../config/capitalize.js'
import NepaliDate from 'nepali-date-converter'
import StudentFees from '../models/studentFeesModel.js'
import protect from '../middleware/authMiddleware.js'
import StudentAttendance from '../models/studentAttendanceModel.js'
import Dashboard from '../models/dashboardModel.js'
const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const students = await Student.find({})

    res.json(students)
  })
)
router.get(
  '/class/:id',
  asyncHandler(async (req, res) => {
    const students = await Student.find({ classname: req.params.id })
    if (students.length > 0) {
      console.log(students)

      res.json(students)
    } else {
      res.status(404).json({ message: 'No students found.' })
    }
  })
)

router.get(
  '/class/:id/attendance',
  asyncHandler(async (req, res) => {
    const students = await StudentAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.id,
    })
    
    if (students) {
      console.log(students)

      res.json(students)
    } else {
      res.status(404).json({ message: 'No students found.' })
    }
  })
)


router.get(
  '/search/:name/:class/:roll_no',
  asyncHandler(async (req, res) => {
    console.log(req.params.name, req.params.class, req.params.roll_no)
    const student = await Student.findOne({
      student_name: capitalize(req.params.name),
      classname: capitalize(req.params.class),
      roll_no: parseInt(req.params.roll_no),
    })
    console.log(student)

    if (student) {
      res.json(student)
    } else {
      res.status(404)
      res.json({ message: 'No student found with the given information.' })
    }
  })
)



router.post(
  '/register',
  

  protect,
  asyncHandler(async (req, res) => {
    const {
      student_name,
      classname,

      address,
      parents_name,
      contact_no,
      gender,

      age,
      email,
      registration_fees,
    } = req.body
    
    const student_info =
      (await Student.find({
        classname: classname,
      })) &&
      (await Student.findOne({ classname: classname })
        .sort({ roll_no: -1 })
        .limit(1))
    if (student_info) {
      var roll_no = student_info.roll_no + 1
    } else {
      var roll_no = 1
    }
    
    
    console.log(req.body)
    const registered_by = req.user.name

    console.log(registered_by)
    const previous_dues = 0
    
    console.log('roll no is', roll_no)
    const studentname = capitalize(student_name)
    const new_student = await Student.create({
      registered_by,
      student_name: studentname,
      email,
      address,
      gender,
      classname,
      contact_no,
      roll_no,
      parents_name,
      age,
      previous_dues,
      registration_fees,
    })
    console.log(new_student)
    if (new_student) {
      const total_students = (await Student.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'Students' },
        { number: total_students }
      )
      console.log('done')
      console.log('total number of students', total_students)
      res.status(201).json({
        message: 'Student registered successfully',
      })
      console.log('registered successfully')
    } else {
      res.status(400)
      console.log(error)
      throw new Error('Unable to register student')
    }
  })
)




router.post(
  '/attendance/:classname',
  protect,
  asyncHandler(async (req, res) => {
    
    const { students } = req.body
    console.log(req.body)
    const class_teacher = req.user.name
    
    const attendanceFound = await StudentAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.classname,
    })
    console.log(attendanceFound)
    if (attendanceFound) {
      await StudentAttendance.updateOne(
        { _id: attendanceFound._id },
        { $set: { students: students } }
      )
      console.log('done with re-attendance')
      res.status(201).json({ message: 'Attendance retaken successfully' })
    } else {
      const new_attendance = await StudentAttendance.create({
        class_teacher,
        classname: req.params.classname,
        attendance_date: new NepaliDate().format('YYYY-MM-D'),
        students,
      })
      console.log(new_attendance)
      if (new_attendance) {
        res.status(201).json({
          message: 'Attendance taken successfully',
        })
      } else {
        res.status(400)
        console.log(error)
        throw new Error('Unable to take attendance')
      }
    }
  })
)




router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
    if (student) {
      await student.remove()
      const total_students = (await Student.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'Students' },
        { number: total_students }
      )
      res.json({ message: 'Student removed' })
    } else {
      res.status(404)
      throw new Error('student not found')
    }
  })
)

router.post(
  '/fees/:id',
  protect,
  asyncHandler(async (req, res) => {
    const {
      student_name,
      classname,
      roll_no,
      month_name,
      year,
      monthly_fees,
      hostel_fees,
      laboratory_fees,
      computer_fees,
      exam_fees,
      miscellaneous,
    } = req.body
    console.log(req.params.id)
    console.log(req.body)
    const student = await Student.findById(req.params.id)
    
    if (student) {
      const accountant = req.user.name
      const fees_submitted = await StudentFees.create({
        accountant,
        student_name,
        classname,
        roll_no,
        month_name,
        year,
        monthly_fees,
        hostel_fees,
        laboratory_fees,
        computer_fees,
        exam_fees,
        miscellaneous,
      })
      if (fees_submitted) {
        const total_Fees = await StudentFees.find()
          .select(
            'monthly_fees hostel_fees laboratory_fees computer_fees exam_fees miscellaneous '
          )
          .select('-_id')
        var total_Fees1 = 0
        total_Fees.map(
          (fee) =>
            (total_Fees1 =
              total_Fees1 +
              fee.monthly_fees +
              fee.hostel_fees +
              fee.laboratory_fees +
              fee.computer_fees +
              fee.exam_fees +
              fee.miscellaneous)
          
        )

        

        
        res.status(201).json({ message: 'Fees Paid successfully' })
        console.log('fees success')
      } else {
        res.status(400)
        throw new Error('Error occured while paying fees')
      }
    } else {
      res.status(404)
      throw new Error('Student not found')
    }
  })
)



export default router
