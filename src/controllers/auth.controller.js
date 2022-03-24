import User from "../models/User";
import Role from "../models/Role";

import jwt from "jsonwebtoken";
import config from "../config";

export const register = async (req, res) => {
  try {
    // Getting the Request Body
    const { name, lastname, dni, roles } = req.body;
    // Creating a new User Object
    const newUser = new User({
      name,
      lastname,
      dni
      // password: await User.encryptPassword(password),
    });

    // checking for roles
    if (req.body.roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    return res.status(200).json({
      register: true
    });
  } catch (error) {
    console.error(error);
    return res.status(304).json(error);
  }
};

export const login = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ dni: req.body.dni }).populate(
      "roles"
    )

    if (!userFound) return res.status(400).json({ message: "Trabajador no registrado" })
    if (!userFound.valid) return res.status(300).json({ message: "Usuario no activado" })
    // const matchPassword = await User.comparePassword(
    //   req.body.password,
    //   userFound.password
    // );

    // if (!matchPassword)
    //   return res.status(401).json({
    //     token: null,
    //     message: "Invalid Password",
    //   });

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 60*60*24*30, // 1 month
    });

    const user = Object.assign({}, {
      dni: userFound.dni,
      name: userFound.name,
      lastname: userFound.lastname,
      roles: userFound.roles,
      id: userFound._id
    })

    res.json({
      token,
      user
    });
  } catch (error) {
    res.status(500).json(error)
  }
};
