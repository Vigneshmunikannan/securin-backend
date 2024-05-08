const mongoose = require('mongoose');


const cveSchema = new mongoose.Schema({
    cveId: String,
    sourceIdentifier: String,
    published: Date,
    lastModified: Date,
    vulnStatus: String,
    descriptions: [{ lang: String, value: String }],
    cvssMetricV2: 
        {
            baseSeverity: String,
            baseScore: Number,
            vectorString: String,
            accessVector: String,
            accessComplexity: String,
            authentication: String,
            confidentialityImpact: String,
            integrityImpact: String,
            availabilityImpact: String,
            exploitabilityScore: Number,
            impactScore: Number
        },
    cpeMatch: [
        {
            vulnerable: Boolean,
            criteria: String,
            matchCriteriaId: String
        }
    ]

});

const CVE = mongoose.model('CVE', cveSchema);

module.exports = CVE;
