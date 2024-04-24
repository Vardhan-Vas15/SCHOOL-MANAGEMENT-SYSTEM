import mongoose from 'mongoose'
const teacherSchema = mongoose.Schema(
  {
    registered_by: {
      type: String,
      required: true,
      ref: 'Admin',
    },
    teacher_name: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Number,
     
    },
    qualification: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    contact_no: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    previous_school: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    estimated_salary: {
      type: Number,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
)



const Teacher = mongoose.model('Teacher', teacherSchema)

export default Teacher
