
const router = express.Router();
const Dictionary = require('../model/dictionary').model;

module.exports = function (express) {

    const getByQuery = async (req, res) => {
        try {
            let searchQuery = {};
            if (req.query.searchTerm) {
                searchQuery.term = new RegExp('^' + req.query.searchTerm + '.*$', "i")
            }

            let result = await Dictionary.find(searchQuery)
                .sort({ term: '1' })
                .limit(10)
                .lean();
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return res.status(400).json(500);
        }
    }

    const getCount = async (req, res, next) => {
        try {
            let searchQuery = {};
            let count = await Dictionary.find(searchQuery).count();
            return res.status(200).json({ count });
        } catch (error) {
            console.log(error);
            return res.status(400).json(500);
        }
    }

    router.get('/count', getCount);

    router.get('/', getByQuery);




    return router;
};