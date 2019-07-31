var capitalize = require('./utils').capitalize;
var getCWEId = require('./utils').getCWEId;

var priorityMap = [
  'Low',
  'Medium',
  'High',
  'Critical'
]

var convert = function (output) {

  var json = '[' + output.split('\n').filter(x => x && x.includes('"type":"auditAdvisory"')).join(',') + ']';
  console.log(json);

  parsedData = JSON.parse(json);
  report = {};
  report.version = "2.0";
  report.vulnerabilities = [];
  report.remediations = [];

  parsedData.forEach(item => {

    var advisory = item.data.advisory;
    var cwe_id = getCWEId(advisory.cwe);

    var identifiers = [];
    if (advisory.cves && advisory.cves[0]) {
      identifiers.push({
        "type": "cve_id",
        "name": advisory.cves[0],
        "value": advisory.cves[0],
        "url": `https://nvd.nist.gov/vuln/detail/${advisory.cves[0]}`
      });
    }
    if (advisory.cwe) {
      identifiers.push({
        "type": "cwe_id",
        "name": advisory.cwe,
        "value": advisory.cwe,
        "url": `https://cwe.mitre.org/data/definitions/${cwe_id}.html`
      });
    }


    report.vulnerabilities.push({
      "tool": "yarn_audit",
      "category": "dependency_scanning",
      "name": advisory.module_name,
      "namespace": advisory.module_name,
      "message": advisory.title,
      "cve": "package.json" + advisory.module_name + ":cve_id:" + advisory.cves[0],
      "description": advisory.overview,
      "severity": capitalize(advisory.severity),
      "fixedby": advisory.reported_by.name,
      "confidence": "High",
      "scanner": {
        "id": "yarn_audit_advisories",
        "name": "Yarn Audit"
      },
      "location": {
        "file": "package.json",
        "dependency": {
          "package": {
            "name": advisory.module_name
          },
          "version": advisory.vulnerable_versions
        }
      },
      "identifiers": identifiers,
      "solution": advisory.recommendation,
      "instances": advisory.findings[0].paths.map(value => ({ method: value })),
      "links": [{
        "url": `https://npmjs.com/advisories/${advisory.id}`
      }]
    });
  });

  return JSON.stringify(report, null, '  ');
}

module.exports = convert;
