import User from "../models/User";
import Role from "../models/Role";

export const createUser = async (req, res) => {
  try {
    const { username, dni, email, cargo, password, roles } = req.body;
    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      dni,
      email,
      cargo,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    // encrypting password
    if (req.body.password) {
      user.password = await User.encryptPassword(user.password);
    }
    
    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
      saved: true
    });
  } catch (error) {
    console.error(error);
  }
};

export const getWorker = async (req, res) => {
  try {
    const { id } = req.params
    const worker = await User.find({_id: id})
    res.status(200).json(worker)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ name: { $nin: "Admin"} }).populate("roles")
    res.status(200).json(workers)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const updateWorker = async (req, res) => {
  try {
    const { id } = req.params
    const valid = req.body.valid
    const foundRoles = await Role.find({ name: { $in: req.body.newRoles } });
    const newRoles = foundRoles.map((role) => role._id);
    const worker = await User.findOne({_id: id})
    await worker.updateOne({valid: valid, roles: newRoles})
    res.status(200).json({message: "saved"})
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const searchWorker = async (req, res) => {
  try {
    const { name } = req.params
    const workers = await User.find({ name: { $nin: "Admin"} })
    const filteredWorker = workers.filter(worker => {
      return worker.toString().toLowerCase().indexOf(name.toLowerCase()) >= 0
    })
    res.status(200).json(filteredWorker)
  } catch (error) {
    return res.status(500).json(error)
  }
}