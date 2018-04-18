module.exports = function (express) {
  let router = express.Router();
  let UserModel = require('../model/user.model').model;
  let jwt = require('jsonwebtoken');
  let bcrypt = require('bcryptjs');
  let config = require('../../../config');
  let MSG = require('../shared/messages/messages');
  let util = require('../shared/util/util');
  let mongoose = require('mongoose');
  router.get('/', async (req, res) => {
    
    return res.status(200).json({ users: [] });

  });

  router.get('/:userId', async (req, res) => {
    let userId = req.params.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'You should include VALID userId in request parameters.');
    }

    try {
      let user = await UserModel.findById(userId);
      if (!user) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'userId you provided does not exist.');
      }

      delete user.passwordHash;
      return res.status(200).json(user);
    } catch (error) {
      return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
    }
  });

  router.put('/', async (req, res) => {
    if (!req.body) {
      return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'User data you provided is incorrect.');
    }

    let updateUserData = req.body;

    try {
      let user = await UserModel.findOne({ _id: req.body._id })
        .lean()
        .exec();
      // Check if old password is correct
      if (!user) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'User was not found');
      }

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
      if (!passwordIsValid) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'Password does not match');
      }

      if (req.body.newPassword) {
        updateUserData.passwordHash = bcrypt.hashSync(req.body.newPassword, 8);
      }

      // Create new password hash and update
      try {
        let updatedUser = await UserModel.findByIdAndUpdate(updateUserData._id, updateUserData, { new: true });
        let token = jwt.sign({ id: user._id }, config.SECRET, {
          expiresIn: config.JWT_TOKEN_EXPIRATION
        });

        updatedUser = await UserModel.populate(updatedUser, { path: 'business', populate: { path: 'businessCategories' } });
        delete updatedUser['passwordHash'];
        return res.status(200).json({ auth: true, token: token, user: updatedUser });
      } catch (error) {
        return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
      }
    } catch (error) {
      return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
    }

  });

  router.post('/register', async (req, res) => {

    try {
      let result = await UserModel.findOne({ email: req.body.email })
        .lean()
        .exec();

      if (result) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'User Exists');
      }

      let user = new UserModel(req.body);
      user.passwordHash = bcrypt.hashSync(req.body.password, 8);

      try {
        let userSaved = await user.save();
        let token = jwt.sign({ id: user._id }, config.SECRET, {
          expiresIn: config.JWT_TOKEN_EXPIRATION // expires in 24 hours
        });

        userSaved = await UserModel.populate(userSaved, { path: 'business', populate: { path: 'businessCategories' } });
        delete userSaved['passwordHash'];
        return res.status(200).json({ auth: true, token: token, user: userSaved });
      } catch (error) {
        return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
      }

    } catch (error) {
      return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
    }

  });

  router.post('/sign-in', async (req, res) => {

    if (!req.body) {
      return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'User data you provided is incorrect.');
    }

    try {
      let user = await UserModel.findOne({ email: req.body.email })
        .lean()
        .populate([{ path: 'business', populate: { path: 'businessCategories' } }])
        .exec();

      if (!user) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'Email was not found');
      }

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
      if (!passwordIsValid) {
        return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'Password does not match');
      }

      let token = jwt.sign({ id: user._id }, config.SECRET, {
        expiresIn: config.JWT_TOKEN_EXPIRATION // expires in 24 hours
      });
      delete user['passwordHash'];
      return res.status(200).json({ auth: true, token: token, user: user });

    } catch (error) {
      return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, error);
    }

  });

  router.get('/log-out', function (req, res) {
    return res.status(200).json({ auth: false, token: null });
  });



  return router;
};