let mongoose = require('mongoose');
let dictionarySchema = mongoose.Schema({
    term: { type: String },
    defAndSource: [
        {
            definition: { type: String },
            source: { type: String },
        }
    ],
    originAndOriginalTerm: [
        {
            origin: { type: String },
            originalTerm: { type: String }
        }
    ],
    type: {
        type: String, enum: [
            'foreign', 'civil', 'civil_education', 
            'universal_encyclopedia', 'botanic', 
            'geo-sulkhan-saba', 'metallurgy', 
            'library_terms', 'maritime', 'medical',
            'grishashvili_tbilisuri', 'geo_material_culture', 'christianity'
        ]
    },
}, {
        timestamps: true
    });

module.exports.model = mongoose.model('Dictionary', dictionarySchema);