module.exports = function (express) {
    let router = express.Router();
    let Dictionary = require('../model/dictionary').model;

    router.get('/', (req, res) => {
        let searchQuery = {};
        if (req.query.searchTerm) {
            searchQuery.term = new RegExp('^' + req.query.searchTerm + '.*$', "i")
        }

        Dictionary.find(searchQuery)
            .sort({term: '1'})
            .limit(10)
            .exec((err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({ result: result });
            })
    });

    return router;
};