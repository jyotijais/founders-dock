const prisma = require('../config/db');

//Register user in PostgreSQL after Firebase signup
const signup = async (req, res) => {
    const { firebase_uid, email, name, role, photo_url } = req.body;

    try {
        //check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { firebase_uid }
        });

        if(existingUser){

            const updatedUser = await prisma.users.update({
                where: {firebase_uid },
                data: {role, name, photo_url }
            });
            return res.status(200).json({message: 'User updated', user: updatedUser });   
        }
        //Create new user in PostgreSQL
        const newUser = await prisma.users.create({
            data: {
                firebase_uid,
                email,
                name,
                role,
                photo_url
            }
        });
        res.status(201).json({message: 'User created successfully', user: newUser});
    }
    catch(error){
        console.error('Signup error: ', error);
        res.status(500).json({message: 'Internal server error' });
    }
};

//Get current logged in user
const getMe = async (req, res) => {
    try{
        const user = await prisma.users.findUnique({
            where: { firebase_uid: req.user.uid}
        });

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({user});
    }
    catch (error){
        console.error('GetMe error:' , error)
        res.status(500).json({message:'Internal server error' });
    }

};

module.exports = {signup, getMe};

