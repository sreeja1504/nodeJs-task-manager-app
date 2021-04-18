const jwt = require('jsonwebtoken');
const User = require('../models/user')
const auth = async (req, res, next) => {
      try {
            const token = req.header('Authorization').replace('Bearer ', '')
            //decoded is payload of jwt
            //     const decoded = jwt.verify(token, 'thisismynewcourse')
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            if (!user) {
                  throw new Error()
            }
            //instead of handling route and fetching record from db after auth , we can use this user fetched from db, to save time by setting in req .
            req.token = token
            req.user = user
            next()
      } catch (e) {
            console.log(e);
            res.status(401).send({ error: 'Please authenticate.' })
      }
}
module.exports = auth