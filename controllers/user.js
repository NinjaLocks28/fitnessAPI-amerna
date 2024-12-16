const bcrypt = require('bcrypt')
const User = require('../models/User')
const auth = require('../auth')
const { errorHandler } = require('../auth')


module.exports.registerUser = (req, res) => {


    const { firstName, lastName, email, password, mobileNo } = req.body


    if(!req.body.email.includes("@")){
        return res.status(400).send({
            message: "Email Invalid"
        })
    } else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({
            message: 'Mobile number invalid'
        })
    } else if (req.body.password.length < 8) {
        return res.status(400).send({
            message: 'Password must be atleast 8 characters'
        })
    } else {

        const hashedPassword = bcrypt.hashSync(password, 10)

        let newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNo
        });

        return newUser.save()
        .then(result => {
            res.status(201).send({
                message: 'Registered Successfully'
            })
        })
        .catch(err => errorHandler(err, req, res))
    }
}


module.exports.loginUser = (req, res) => {

    const { email, password } = req.body

    if(email.includes('@')) {
        return User.findOne({ email})
        .then(result => {
            if(result === null) {
                return res.status(404).send({
                    message: 'No Email found'
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(
                    password, result.password)
                    
                if(isPasswordCorrect) {
                    return res.status(201).send({
                        access: auth.createAccessToken(result)
                    })
                } else {
                    return res.status(401).send({
                        message: 'Email and password do not match'
                    })
                }

            }
        })
        .catch(err => errorHandler(err, req, res))
    } else {
        return res.status(400).send({
            message: 'Invalid Email'
        })
    }
}


module.exports.getProfile = (req, res) => {

    const userId = req.user.id

    return User.findById(userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: 'User not found'
            })
        }

        user.password = "";
        return res.status(200).send({user})

    })
    .catch(err => errorHandler(err, req, res))

}


module.exports.resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const { id } = req.user;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                message: 'Old password is incorrect'
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send({
                message: 'New password cannot be the same as the old password'
            });
        }

        if(newPassword.length < 8) {
            return res.status(400).send({
                message: 'Password must be atleast 8 characters'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).send({
            message: 'Password reset successfully'
        });
    } catch (error) {
        errorHandler(err, req, res)
        }
}


