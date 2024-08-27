const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./user'); // User model
const Company = require('./company'); // Company model
const saltRounds = 10;

const router = express.Router();

// Authentication Routes
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Company Routes
router.post('/companyregister', async (req, res) => {
  try {
    const { Companyname, Ownername, CompanySector, Employername, Employeremail, password } = req.body;

    const existingCompany = await Company.findOne({ Employeremail });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newCompany = new Company({
      Companyname,
      Ownername,
      CompanySector,
      Employername,
      Employeremail,
      password: hashedPassword
    });
    await newCompany.save();

    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/companylogin', async (req, res) => {
  try {
    const { Employeremail, password } = req.body;

    const company = await Company.findOne({ Employeremail });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const passwordMatch = await bcrypt.compare(password, company.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
