# GitLab parser for Yarn Audit

Parses `yarn audit` output into GitLab `gl-dependency-scanning-report.json` format.

Adapted from https://github.com/mgibeau/gitlab-npm-audit-parser

```
Usage: gitlab-ci-yarn-audit-parser [options]

Options:

  -V, --version     output the version number
  -o, --out <path>  output filename, defaults to gl-dependency-scanning-report.json
  -h, --help        output usage information
```

## How to use

Install this package.

```
npm install --save-dev gitlab-ci-yarn-audit-parser
```

Add the following job to _.gitlab-ci.yml_

```yaml
dependency scanning:
  image: node:10-alpine
  script:
    - npm ci
    - npm audit --json | npx gitlab-ci-yarn-audit-parser -o gl-dependency-scanning.json
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning.json
```

## Test

`cat test/angular.json | ./parse.js -o gl-dependency-scanning-report.json`
