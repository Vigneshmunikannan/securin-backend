const asynchandler = require('express-async-handler');
const CVE=require('../datamodels/CVE')

const list=asynchandler(
    async (req, res) => {
        try {
          // Pagination parameters
          const resultsPerPage = parseInt(req.query.resultsPerPage) || 10; // Default to 10 if not provided
          const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      
          // Calculate skip value based on page and resultsPerPage
          const skip = (page - 1) * resultsPerPage;
      
          // Fetch data from the database with pagination
          const cves = await CVE.find()
            .skip(skip)
            .limit(resultsPerPage)
            .select('cveId sourceIdentifier published lastModified vulnStatus');
      
          // Count total records in the database
          const totalRecords = await CVE.countDocuments();
      
          res.json({ cves, totalRecords });
        } catch (error) {
          console.error('Error fetching CVEs:', error);
          res.status(500).json({ error: 'Failed to fetch CVEs' });
        }
      }
  )

  const getSingleData = asynchandler(async (req, res) => {
    try {
      const cveId = req.params.cveId; // Assuming the CVE ID is passed as a parameter in the request
      const cve = await CVE.findOne({ cveId })
      .select('cveId descriptions cvssMetricV2 cpeMatch');
      if (!cve) {
        return res.status(404).json({ error: 'CVE not found' });
      }
      res.json(cve);
    } catch (error) {
      console.error('Error fetching single CVE data:', error);
      res.status(500).json({ error: 'Failed to fetch single CVE data' });
    }
  });


module.exports = {
    list,
    getSingleData
};
