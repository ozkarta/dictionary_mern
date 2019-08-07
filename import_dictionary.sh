mongodb://localhost:27017/ucxo?readPreference=primary

mongoimport --uri 'mongodb://localhost:27017/ucxo?readPreference=primary' --collection dictionaries --type json --file ./dictionaries.json
