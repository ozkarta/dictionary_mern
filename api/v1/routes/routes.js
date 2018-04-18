module.exports = function (express) {
  var router = express.Router();

  //__________________________________
  let dictionaryController = require('../controller/dictionary.controller')(express);

  router.use('/dictionary', dictionaryController);

  return router;
};
