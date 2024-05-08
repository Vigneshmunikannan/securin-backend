
const asynchandler = require('express-async-handler');
const axios = require('axios');
const CVE = require('../datamodels/CVE');

const getdata = asynchandler(async (from) => {
  try {
    console.log(from)
    let offset = 0;
    const limit = 1000;
    const cves = await fetchCVEs(offset, limit);
    await storeCVEs(cves);
    await cleanseAndDeduplicateCVEs();
  } catch (error) {
    console.error('Error synchronizing', error.message);
    throw error;
  }
})

async function fetchCVEs(offset, limit) {
  const url = `https://services.nvd.nist.gov/rest/json/cves/2.0/?resultsPerPage=${limit}&startIndex=${offset}`;

  try {
    const response = await axios.get(url);
    return response.data.vulnerabilities;
  } catch (error) {
    console.error('Error fetching CVEs:');
  }
}



async function cleanseAndDeduplicateCVEs() {
  try {
    const duplicateCVEs = await CVE.aggregate([
      {
        $group: {
          _id: '$cveId',
          count: { $sum: 1 },
          duplicates: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    // Iterate over duplicate CVEs and remove duplicates except the first occurrence
    await Promise.all(duplicateCVEs.map(async (doc) => {
      const duplicatesToDelete = doc.duplicates.slice(1); // Skip the first occurrence
      await CVE.deleteMany({ _id: { $in: duplicatesToDelete } });
    }));

    console.log('Data cleansing and deduplication completed.');
  } catch (error) {
    console.error('Error performing data cleansing and deduplication:', error.message);
    throw error;
  }
}


async function insertCVEData(data) {
  try {
    const result = await CVE.insertMany(data);
    console.log(`${result.length} CVE records inserted successfully.`);
  } catch (error) {
    console.error('Error inserting CVE data:', error);
    throw error;
  }
}


async function storeCVEs(cves) {
  try {
    const formattedData = cves.map(item => {
      // Check if cvssMetricV2 array exists and has elements before accessing its properties
      const firstMetric = item.cve.metrics?.cvssMetricV2?.[0] || {};
      const {
        baseScore,
        vectorString,
        accessVector,
        accessComplexity,
        authentication,
        confidentialityImpact,
        integrityImpact,
        availabilityImpact,
      } = firstMetric.cvssData || {};

      const {
        baseSeverity,
        exploitabilityScore,
        impactScore
      } = firstMetric;

      // Check if configurations array exists and has elements before accessing its properties
      const cpeMatch = (item.cve.configurations?.[0]?.nodes?.[0]?.cpeMatch) || [];

      // Define the properties of the object here
      return {
        cveId: item.cve.id,
        sourceIdentifier: item.cve.sourceIdentifier,
        published: new Date(item.cve.published),
        lastModified: new Date(item.cve.lastModified),
        vulnStatus: item.cve.vulnStatus,
        descriptions: item.cve.descriptions,
        cvssMetricV2: {
          baseSeverity,
          baseScore,
          vectorString,
          accessVector,
          accessComplexity,
          authentication,
          confidentialityImpact,
          integrityImpact,
          availabilityImpact,
          exploitabilityScore,
          impactScore
        },
        cpeMatch
      };
    });

    // If formattedData is not empty, insert the data
    if (formattedData.length !== 0) {
      await insertCVEData(formattedData);
      console.log('CVEs stored successfully.');
    } else {
      console.log('No CVEs to store.');
    }
  } catch (error) {
    console.error('Error storing CVEs:', error.message);
    throw error;
  }
}





module.exports = {
  getdata
};