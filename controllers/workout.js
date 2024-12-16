const Workout = require('../models/Workout')
const { errorHandler } = require('../auth')

module.exports.addWorkout = (req, res) => {
    
    const { name, duration } = req.body
    const userId = req.user.id

    if(!name || !duration) {
        return res.status(400).send({
            message: 'Name and duration are required fields'
        })
    } 

    const newWorkout = new Workout ({
        userId,
        name,
        duration
    })

    newWorkout.save()
    .then(workout => {
        res.status(201).send({
            message: workout
        })
    })
    .catch(err => errorHandler(err, req, res))
}


module.exports.getMyWorkouts = (req, res) => {

    const userId = req.user.id

    return Workout.find( {userId} )
    .then (workout => {
        if (!workout) {
            return res.status(404).send({
                message: 'No workout found'
            })
        } 
        return res.status(200).send({
            workouts: workout
        })
    })
    .catch(err => errorHandler(err, req, res))
}


module.exports.updateWorkout = (req, res) => {

    const userId = req.user.id;
    const workoutId = req.params.id;

    const { name, duration } = req.body;


    Workout.findByIdAndUpdate(
        { _id: workoutId, userId },
        { $set: { name, duration }},
        { new: true}
    )

    .then(workout => {
        if(!workout) {

            return res.status(404).send({
                message: 'No workout found'
            })
        } 
        return res.status(200).send({
            message: 'Workout updated successfully',
            updatedWorkout: workout
        })
    })
    .catch (err => errorHandler (err, req, res))
}


module.exports.deleteWorkout = (req, res) => {

    const userId = req.user.id;
    const workoutId = req.params.id;

    Workout.findByIdAndDelete({
        _id: workoutId, userId
    })

    .then(workout => {
        if(!workout) {
            return res.status(404).send({
                message: "No workout found"
            })
        }
        return res.status(200).send({
            message: 'Workout deleted successfully'
        })
    })
    .catch(err => errorHandler(err, req, res))
}


module.exports.completeWorkoutStatus = (req, res) => {

    const userId = req.user.id;
    const workoutId = req.params.id;

    Workout.findByIdAndUpdate(
        { _id: workoutId, userId },
        { $set: {status: 'completed'}},
        { new: true }
    )
    .then(workout => {
        if (!workout) {
            return res.status(404).send({
                message: "No workout found"
            })
        }
        return res.status(200).send({
            message: 'Workout updated successfully',
            updatedWorkout: workout
        })
    })
    .catch(err => errorHandler(err, req, res))

}