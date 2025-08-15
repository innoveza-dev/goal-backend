const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, CompanyProfile } = require('../models');

const JWT_SECRET = 'your_secret_key_here';

// Signup Controller
async function signup(req, res) {
  try {
    const {
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
    } = req.body;

    if (!companyName || !firstName || !lastName || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let company = await CompanyProfile.findOne({ where: { companyName } });
    if (!company) {
      company = await CompanyProfile.create({
        companyName,
      });
    }

    let role = 'admin';
    if (
      firstName.toLowerCase() === 'bansi' &&
      email.toLowerCase() === 'bansi.innoveza@gmail.com'
    ) {
      role = 'superadmin';
    }

    const newUser = await User.create({
      companyId: company.id,
      companyName,
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      photo: '',
      role,
    });

    if (!company.userId) {
      await company.update({ userId: newUser.id });
    }


    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role, companyId: newUser.companyId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );



    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile,
        companyId: newUser.companyId,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

//  Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{
        model: CompanyProfile,
        as: 'companyProfile',
      }],
    });


    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }



    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, companyId: user.companyProfile?.id || null},
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        photo: user.photo,
        companyId: user.companyProfile?.id || null,
        companyProfile: user.companyProfile || null,
      },
    });
    console.log("Login response user.companyId:", user.companyId);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

//  Create Profile
const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      firstName, lastName, email, mobile, gender, dateOfBirth, anniversaryDate,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const photo = req.file ? req.file.filename : user.photo;

    await user.update({
      firstName, lastName, email, mobile, gender, dateOfBirth, anniversaryDate, photo,
    });

    res.status(200).json({ message: 'Profile created/updated successfully', user });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'gender', 'dateOfBirth', 'anniversaryDate', 'photo'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      firstName, lastName, mobile, gender, dateOfBirth, anniversaryDate, email,
    } = req.body;

    const photo = req.file ? req.file.filename : user.photo;

    await user.update({
      firstName, lastName, mobile, gender, dateOfBirth, anniversaryDate, email, photo,
    });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Delete Profile 
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Delete profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get All Profiles
const getAllProfiles = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'gender', 'dateOfBirth', 'anniversaryDate', 'photo'],
    });
    res.status(200).json(users);
  } catch (err) {
    console.error('Get all profiles error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, createProfile, getProfile, updateProfile, deleteProfile, getAllProfiles };
