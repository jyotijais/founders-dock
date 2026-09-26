const prisma = require('../config/db');

//create a new pitch
const createPitch = async(req, res) => {
    const {title, description, industry, stage, funding_goal, location, team_size, tags, linkedin, website } = req.body;

    try{
        //Get user from postgresSQL using firebase_uid
        const user = await prisma.users.findUnique({
            where: {firebase_uid: req.user.uid}
        });

        if(!user){
            return res.status(404).json({message: 'user not found'});
        }

        const newPitch = await prisma.pitches.create({
            data: {
                title,
                description,
                industry,
                stage,
                funding_goal,
                location,
                team_size,
                tags,
                website,
                linkedin,
                user_id: user.id,
                firebase_uid: req.user.uid
            }
        });

        res.status(201).json({message: 'Pitch created successfully', newPitch});
    }
    catch(error) {
        console.error('Create pitch error:', error);
        res.status(500).json({message: 'Internal server error' });
    }
};

//Get all pitches
const getAllPitches = async(req, res) => {
    try {
        const pitches = await prisma.pitches.findMany({
            orderBy: {created_at: 'desc'}
        });
        res.status(200).json({ pitches });
    } catch(error){
        console.error('Get pitches error', error);
        res.status(500).json({message: 'Internal server error' });
    }
};

//Get single pitch by Id
const getPitchById = async(req, res) => {
    const { id } = req.params;
    try {
        const pitch = await prisma.pitches.findUnique({
            where: { id: parseInt(id) }
        });
        if(!pitch){
            return res.status(404).json({message: 'Pitch not found'});
        }
        res.status(200).json({ pitch });
    } catch(error){
        console.error('Get pitch error', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

//update pitch

const updatePitch = async (req, res) => {
    const { id } = req.params;
    const { title, description, industry, stage, funding_goal, location, team_size, tags, linkedin, website } = req.body;

try {
    //check if pitch belongs to the user
    const pitch = await prisma.pitches.findUnique({
        where: {id: parseInt(id)}
    });
    if(!pitch){
        return res.status(404).json({message: 'Pitch not found'});
    }
    if(pitch.firebase_uid !== req.user.uid){
        return res.status(403).json({message: 'unauthorized - not you pitch'});
    }
    const updatedPitch = await prisma.pitches.update({
        where: {id: parseInt(id)},
        data: {
            title,
            description,
            industry,
            stage,
            funding_goal,
            location,
            team_size,
            tags,
            website,
            linkedin
        }
    });

    res.status(200).json({message: 'Pitch updated successfully', Pitch: updatedPitch});
    } catch(error) {
        console.error('Update pitch error', error);
        res.status(500).json({message: 'Internal server error' });
    }
};

//Delete Pitch
const deletePitch = async (req, res) => {
    const { id } = req.params;
    try{
        //Check if pitch belongs to the user
        const pitch = await prisma.pitches.findUnique({
            where: {id: parseInt(id)}
        });
        if(!pitch){
           return res.status(404).json({message: 'Pitch not found'}); 
        }
        if(pitch.firebase_uid !== req.user.id){
            return res.status(403).json({message: 'Unauthorized - not your pitch'});
        }
        const deletedPitch = await prisma.pitches.delete({
            where:{id: parseInt(id)}
        });
        res.status(200).json({message: 'Pitch deleted successfully', Pitch: deletedPitch});
    } catch(error){
        console.error('Delete pitch error', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {createPitch, getAllPitches, getPitchById, updatePitch, deletePitch}; 