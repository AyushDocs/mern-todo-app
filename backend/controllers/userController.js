import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60
  })
}

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" })
    }
    const user = userModel.getUserByEmail(email)

    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const token = createToken(user.id)
    res.status(200).json({ user, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //check if user already exists
    const exists = userModel.getUserByEmail(email)
    if (exists) {
      return res.status(400).json({ message: "User already exists" })
    }
    if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).json({ message: "Please enter all fields" })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" })
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Please enter a strong password" })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = userModel.createUser(name, email, hashedPassword)
    const token = createToken(newUser.id)
    res.status(200).json({ user: newUser, token })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//get user info
const getUser = async (req, res) => {
  const id = req.user.id
  try {
    const user = userModel.getUserById(id)
    res.status(200).json({ user: user })
  } catch (error) {
    res.status(502).json({ message: error.message })
  }
}
export { loginUser, registerUser, getUser }