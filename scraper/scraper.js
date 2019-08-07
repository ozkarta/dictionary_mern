let mongoose = require('mongoose');
let config = require('./config');
let http = require('http');
let url = require('url');
let cheerio = require('cheerio');
let Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.connect(config.DB_URL);
const db = mongoose.connection;
const concurrency = 20;
//____________________________
const baseUrl = 'http://www.nplg.gov.ge';
const Dictionary = require('./models/dictionary').model;

db.on('error', function (err) {
    console.error(err);
});
db.once('open', async function callback() {
    console.log('DB connection established', config.DB_URL);
    // უცხო სიტყვათა +
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=3', 'foreign');

    // civil encyclopedy +
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=5', 'civil');

    // civil education +
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=6', 'civil_education');

    // universal encyclopedia
    runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=14', 'universal_encyclopedia');

    // Botanic
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=11', 'botanic');

    // georgian -> sulxan saba
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=8', 'geo-sulkhan-saba');
    
    // metallurgy
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=15', 'metallurgy');

    //library_terms
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=10', 'library_terms');

    // maritime
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=40', 'maritime');

    // medical
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=13', 'medical');

    // grishashvili_tbilisuri
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=30', 'grishashvili_tbilisuri');

    //geo_material_culture
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=39', 'geo_material_culture');

    //christianity
    //runForeignScraper('http://www.nplg.gov.ge/gwdict/index.php?a=index&d=16', 'christianity');
});

async function runForeignScraper(dictionaryMainUrl, dictionaryType) {

    let startTime = new Date();
    console.log('Foreign scraper started AT:', startTime);
    //let dictionaryMainUrl = 'http://www.nplg.gov.ge/gwdict/index.php?a=index&d=3';
    try {
        let dictionaryMainPageData = await fetchRequestedHttpUrlPromise(dictionaryMainUrl);
        let searchCriterias = extractSearchCriterias(dictionaryMainPageData);
        let searchUrls = searchCriterias.map(crt => crt.href);
        //console.dir(searchUrls);
        try {
            console.log('Fetching Search Page Urls');
            let searchPages = await fetchUrlsInBatch(searchUrls, concurrency);
            console.log();
            console.log(`We Got ${searchPages.length} Search Pages.`);
            //let searchPagesWithPaginationUrls = ['http://www.nplg.gov.ge/gwdict/index.php?a=list&d=3&t=dict&w1=A'];

            let searchPagesWithPaginationUrls = searchPages.map(page => {
                let pageCount = extractCountFromThePage(page.urlString, page.data);
                let arr = [];
                for (let i = 1; i <= pageCount; i++) {
                    let urlWithPagination = `${page.urlString}&p=${i}`;
                    arr.push(urlWithPagination);
                }
                return arr;
            }).reduce((prev, act) => {
                return prev.concat(act)
            }, []);


            try {
                console.log(`Fetching ${searchPagesWithPaginationUrls.length} pages...`);
                let searchPagesWithPaginationHtmlData = await fetchUrlsInBatch(searchPagesWithPaginationUrls, concurrency);
                console.log(`\nFetching finished for ${searchPagesWithPaginationHtmlData.length} URLs`);

                //let detailUrls = ['http://www.nplg.gov.ge/gwdict/index.php?a=term&d=6&t=13669'];

                let detailUrls = searchPagesWithPaginationHtmlData.map(obj => {
                    return extractDetailUrls(obj.urlString, obj.data);
                }).reduce((prev, act) => {
                    return prev.concat(act)
                }, []);

                console.log(`We got ${detailUrls.length} Detail URLS`);
                try {
                    console.log(`Fetching ${detailUrls.length} Detail Pages...`);

                    let detailPages = await fetchUrlsInBatch(detailUrls, concurrency);

                    console.dir(`we got ${detailPages.length} detail pages`);

                    let dictionary = detailPages.map(page => {
                        return extractDetailPageData(page.urlString, page.data);
                    });

                    console.log(`We got ${dictionary.length} items to save`);

                    let dictionarySavePromiseArray = dictionary.map(dictionaryObject => {
                        dictionaryObject.type = dictionaryType;
                        return checkIfDictionaryRecordExistsAndSave(dictionaryObject, dictionaryType);
                    });
                    Promise.all(dictionarySavePromiseArray)
                        .then(result => {
                            // Count saved objects
                            let log = result.reduce((prev, current) => {
                                if (current) {
                                    if (current.error) {
                                        prev.error++;
                                    }

                                    if (current.update) {
                                        prev.update++;
                                    }

                                    if (current.create) {
                                        prev.create++;
                                    }

                                } else {
                                    prev.noAction++;
                                }

                                return prev;
                            }, {
                                    noAction: 0,
                                    error: 0,
                                    update: 0,
                                    create: 0
                                });

                            console.log('error', log.error);
                            console.log('update', log.update);
                            console.log('create', log.create);
                            console.log('noAction', log.noAction);

                            let endTime = new Date();
                            console.log('Finished at:', endTime);
                            console.log(`Scraping took ${(endTime-startTime) / 1000 / 60} minutes.`);
                        })
                        .catch(exception => {
                            console.dir(exception);
                        });

                } catch (exception) {
                    console.dir(exception);
                    console.log('Scraping failed!');
                }

            } catch (exception) {
                console.dir(exception);
                console.log('Scraping failed!');
            }

        } catch (exception) {
            console.dir(exception);
            console.log('Scraping failed!');
        }
    } catch (exception) {
        console.dir(exception);
        console.log('Scraping failed!');
    }

}

function fetchRequestedHttpUrl(urlString, callback) {
    let urlOptions = url.parse(urlString);
    let responseBody = '';
        let req = http.request(urlOptions, (response) => {
            response.on('data', (data) => {
                responseBody += data.toString();
            });
            response.on('end', (data) => {
                return callback(null, responseBody);
            });
        });

        req.on('error', (err) => {
            console.log('ERROR FETCHING URL', urlString);
            return callback(err, null);
        });

        req.end();
}

async function fetchRequestedHttpUrlPromise(urlString) {
    return new Promise((resolve, reject) => {
        return fetchRequestedHttpUrl(urlString, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    });
}

function fetchUrlsInBatch(urls, concurrency) {
    let counter = 1;
    return Promise.map(urls, (urlString) => {
        return new Promise((resolve, reject) => {
            fetchRequestedHttpUrlPromise(urlString)
                .then(
                    data => {
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                        process.stdout.write("Fetched " + counter++);
                        return resolve({ data: data, urlString, urlString });
                    }
                )
                .catch(exception => resolve({ exception: exception }));
        })
    }, { concurrency: concurrency });
}

function extractSearchCriterias(htmlDataString) {
    let result = [];

    let $ = cheerio.load(htmlDataString);
    let selector = `div[class='az']`;

    if ($(selector).length) {
        let targetElement = $(selector);
        targetElement.children().each(i => {
            let element = targetElement.children().eq(i);
            if (element.prop('tagName') === 'A') {
                result.push({
                    name: element.text(),
                    href: `${baseUrl}${element.prop('href')}`
                });
            }
        });
    }

    return result;
}

function extractCountFromThePage(urlString, htmlPageDataString) {
    let result = 0;

    let $ = cheerio.load(htmlPageDataString);
    let selector = `div[class='navpages']`;

    if ($(selector).length) {
        let targetElement = $(selector);
        let length = targetElement.children().eq(targetElement.children().length - 2).text();
        result = parseInt(length) || 1;
    } else {
        console.log('Counter Selector was not found', urlString);
    }

    return result;
}

function extractDetailUrls(urlString, htmlPageDataString) {
    let result = [];
    if (!htmlPageDataString) {
        console.log('HTML is empty ->', urlString);
        return result;
    }

    let $ = cheerio.load(htmlPageDataString);
    let selector = `dl[class='termlist']`;


    if ($(selector).length) {
        let targetElement = $(selector);

        targetElement.children().each(i => {
            if (targetElement.children().eq(i).prop('tagName') === 'DT') {
                let href = targetElement.children().eq(i).children().first().prop('href');
                if (href) {
                    if (href.indexOf('www.nplg.gov.ge') < 0 || href.indexOf(baseUrl) < 0) {
                        result.push(`${baseUrl}${href}`);
                    } else {
                        result.push(href);
                    }                        
                }
            }
        });

    } else {
        console.log('TermList Selector was not found', urlString);
    }

    return result;
}

function extractDetailPageData(urlString, htmlPageDataString) {
    let result = {
        term: '',
        defAndSource: [
        ],
        originAndOriginalTerm: [
        ]
    };
    let defAndSource = {}

    let $ = cheerio.load(htmlPageDataString);
    let termSelector = `h1[class='term']`;
    let defSelector = `div[class='defn']`;
    let sourceSelector = `div[class='gwsrc']`;
    let defBlock = `div[class='defnblock']`;


    if ($(termSelector).length) {
        let targetElement = $(termSelector);
        result.term = targetElement.text();

    } else {
        console.log('Term Selector was not found', urlString);
    }

    if ($(defSelector).length) {
        let targetElement = $(defSelector);
        defAndSource.definition = targetElement.text();
    } else {
        console.log('Definition Selector was not found', urlString);
    }

    if ($(sourceSelector).length) {
        let targetElement = $(sourceSelector);
        defAndSource.source = targetElement.contents()
            .filter(function () {
                return this.nodeType === 3;
            }).eq(0).text().replace('\n', '').trim();
    } else {
        console.log('Source Selector was not found', urlString);
    }

    if ($(defBlock).length) {
        let targetElement = $(defBlock);
        targetElement.children().eq(0).children().each(i => {
            if ((i + 1) < targetElement.children().eq(0).children().length &&
                targetElement.children().eq(0).children().eq(i).prop('tagName') === 'ACRONYM' &&
                targetElement.children().eq(0).children().eq(i + 1) &&
                targetElement.children().eq(0).children().eq(i + 1).prop('tagName') === 'SPAN') {
                result.originAndOriginalTerm.push({
                    origin: targetElement.children().eq(0).children().eq(i).prop('title'),
                    originalTerm: targetElement.children().eq(0).children().eq(i + 1).text()
                })
            }
        })

    } else {
        console.log('Definition Selector was not found', urlString);
    }

    result.defAndSource.push(defAndSource);

    return result;
}

function checkIfDictionaryRecordExistsAndSave(dictionaryObject, dictionaryType) {
    return new Promise((resolve, reject) => {
        // All of these properties must exist for Dictionary Object
        // if not record will not be saved
        if (!(dictionaryObject.term)) {
            return resolve(null);
        }
        Dictionary.findOne({ term: dictionaryObject.term, type: dictionaryType }).exec((err, existingDictionary) => {
            if (err) {
                console.dir(err);
                return resolve({ error: true });
            }
            if (!existingDictionary) {
                // Create new Dictionary and save
                let dictionary = new Dictionary(dictionaryObject);
                return dictionary.save(afterCreate);
            }

            let shouldUpdate = true;
            if (existingDictionary.defAndSource && existingDictionary.defAndSource.length) {

                for (let i = 0; i < existingDictionary.defAndSource.length; i++) {
                    if (existingDictionary.defAndSource[i].definition === dictionaryObject.defAndSource[0].definition) {
                        shouldUpdate = false;
                        i = existingDictionary.defAndSource.length
                    }
                }

                if (shouldUpdate) {
                    existingDictionary.defAndSource = existingDictionary.defAndSource.concat(dictionaryObject.defAndSource);
                }
            } else {
                existingDictionary.defAndSource = [];
                existingDictionary.defAndSource = existingDictionary.defAndSource.concat(dictionaryObject.defAndSource);
            }

            if (dictionaryObject && dictionaryObject.originAndOriginalTerm && dictionaryObject.originAndOriginalTerm.length) {
                for (let i = 0; i < dictionaryObject.originAndOriginalTerm.length; i++) {
                    let shouldAdd = true;
                    for (let j = 0; j < existingDictionary.originAndOriginalTerm.length; j++) {
                        if (existingDictionary.originAndOriginalTerm[j].origin === dictionaryObject.originAndOriginalTerm[i].origin) {
                            shouldAdd = false;
                            j = existingDictionary.originAndOriginalTerm.length;
                        }
                    }

                    if (shouldAdd) {
                        existingDictionary.originAndOriginalTerm.push(dictionaryObject.originAndOriginalTerm[i]);
                        shouldUpdate = true;
                        objToAdd = null;
                    }
                }
            }

            if (shouldUpdate) {
                return existingDictionary.save(afterUpdate);
            } else {
                return resolve(null);
            }

            function afterCreate(err, saved) {
                if (err) {
                    console.dir(err);
                    return resolve({ error: true });
                }
                return resolve({ create: true });
            }
            function afterUpdate(err, saved) {
                if (err) {
                    console.dir(err);
                    return resolve({ error: true });
                }
                return resolve({ update: true });
            }
        });
    });
}