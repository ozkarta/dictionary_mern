

module.exports = function (express) {
    const path = require('path');
    const router = express.Router();
    const Dictionary = require('../model/dictionary').model;
    const fs = require('fs');

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

    const generateSiteMap = async (req, res, next) => {
        try {
            let searchQuery = {};
            let items = await Dictionary.find(searchQuery).limit(200000);
            let siteMapFiles = [];
            for (let i=0; i < (items.length || 0) / 50000 + 1; i++) {
                siteMapFiles.push({
                    file: `${__basedir}/sitemaps/main_site_map_${i+1}.txt`,
                    content: ''
                });
            }

            
            items.forEach((item, index) => {
                let fileIndex = Math.floor(index / 50000);
                siteMapFiles[fileIndex].content += `http://thedict.ge/${item.term}`;
                if ((index + 1) % 50000) {
                    siteMapFiles[fileIndex].content += '\n';
                }
            });
            let promiseArray = [];
            siteMapFiles.forEach(fileItem => {
                promiseArray.push(new Promise((resolve, reject) => {
                    fs.writeFile(
                        fileItem.file,
                        fileItem.content,
                    (error) => {
                        if (error) throw error;
                        resolve();
                    });
                }))
            });

            Promise.all(promiseArray).then(() => {
                return res.status(200).json({});
            }).catch(error => {
                console.log(error);
                return res.status(500).json(error);
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json(500);
        }
    }

    router.get('/count', getCount);

    router.get('/', getByQuery);

    router.post('/generate-main-sitemap', generateSiteMap);


    return router;
};