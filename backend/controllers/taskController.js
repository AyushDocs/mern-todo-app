import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendMail = (email, subject, title, description) => {
  var transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  var mailOptions = {
    from: "ayushalokdubey@gmail.com",
    to: email,
    subject: subject,
    html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const addTask = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const user = userModel.getUserById(userId);
  const newTask = taskModel.createTask(title, description, userId, false);
  sendMail(user.email, "Task Added", title, description);
  return res.status(200).json({ message: "Task added successfully" });
};
const removeTask = (req, res) => {
  const { id } = req.body;
  console.log("id: ", id);
  taskModel.deleteTaskById(id);
  return res.status(200).json({ message: "Task deleted successfully" });
};

const getTask = (req, res) => {
  const data = taskModel.getTasksByUserId(req.user.id);
  return res.status(200).json(data);
};
export { addTask, getTask, removeTask };