const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { SECRET_KEY, SALT } = process.env;

const login=async(req,res)=>
{
    try
    {
        const {email,password}=req.body;
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(401).send({message:"invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch)
        {
            return res.status(401).send({message:"invalid email or password"});
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ token });
    }
    catch(error)
    {
        return res.status(500).send({message:"Internal Server Error"});
    }
};

const signup = async (req, res) => 
{
    console.log("got signup request");
    console.log(req.body);
    try
    {
        const user = await User.findOne({ email: req.body.email });
        if (user) 
        {
        return res.status(409).send({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(Number(SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = await new User({ ...req.body, password: hashedPassword }).save();
        console.log(SALT,SECRET_KEY);
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });
        console.log("new user created");
        res.status(201).send({token});

    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const getUser = async (req, res) =>
{
    try
    {
        res.status(200).send(req.user);
    }
    catch (error) 
    {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}


module.exports = {
    login,
    signup,
    getUser
};
