const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// Create Student Promise
router.post("/create", (req, res) => {
   const cohort = `Cohort ${req.body.cohort}`;
   const studentModel = new Student({
      name: req.body.name,
      email: req.body.email,
      cohort: cohort,
      phoneNumber: req.body.phoneNumber,
   });

   studentModel.save().then((savedStudent) => {
      res.json(savedStudent);
   });
});

// Create2 Student Async
router.post("/create2", async (req, res) => {
   const cohort = `Cohort ${req.body.cohort}`;

   const studentModel = new Student({
      name: req.body.name,
      email: req.body.email,
      cohort: cohort,
      phoneNumber: req.body.phoneNumber,
   });

   const savedStudent = await studentModel.save();

   res.json(savedStudent);
});

// Find All Student
router.get("/", async (req, res) => {
   const student = await Student.find();
   res.json(student);
});

/**
 * Find One Student
 * Find document via query params `name` or `objectId`
 * Query Strings
 * ?by=name&q=
 * ?by=id&q=
 */
router.get("/find", async (req, res) => {
   const getByQuery = req.query.by;
   const queryParam = req.query.q;
   let students = [];

   // Switch based on the search query passed
   switch (getByQuery) {
      case "name":
         const nameQuery = queryParam;
         students = await Student.find({
            name: new RegExp(`${nameQuery}`, "gi"),
         });

         if (!students) res.json({ message: "Student Not Found" });
         else res.json(students);
         break;
      case "id":
         const idQuery = queryParam;
         students = await Student.findById(idQuery);

         if (students.length < 0) res.json({ message: "Student Not Found" });
         else res.json(students);
         break;
      default:
         res.json({ message: "No Students Found..." });
         break;
   }
});

// Update Student
router.put("/update/:id", async (req, res) => {
   // this student found from the id in the url
   const oldStudent = await Student.findOneAndUpdate(
      { _id: req.params.id },
      req.body
   );

   const updatedStudent = await Student.findOne({ _id: req.params.id }); // get updated student to return as json

   if (oldStudent) {
      return res.json({
         message: "success",
         oldStudent: oldStudent,
         updatedStudent,
      });
   } else {
      res.json({ message: "No Student Found..." });
   }
});

// Delete Student
router.delete("/delete/:id", async (req, res) => {
   const deletedStudent = await Student.findOneAndDelete({
      _id: req.params.id,
   });

   if (deletedStudent) {
      return res.json({ message: "success", deletedStudent });
   } else {
      res.json({ message: "No Student Found..." });
   }
});

module.exports = router;
