const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  component: {
    fixturesFolder: 'cypress/fixtures',
    integrationFolder: 'cypress/integration',
    pluginsFile: 'cypress/plugins/index.js',
    screenshotsFolder: 'cypress/screenshots',
    supportFile: 'cypress/support/e2e.js',
    videosFolder: 'cypress/videos',
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            fs.unlinkSync(results.video)
          }
        }
      })
      on('after:run', (results) => {
        const { exec } = require('child_process')
        // const cmd = `scripts/test_clean.php --user=cypress --env=local --alert-when-done --skip-confirm`

        // console.log('Cleaning up nodes and files created by cypress...')
        // exec(cmd, (error, stdout, stderr) => {
        //   if (error) {
        //     console.log(`error: ${error.message}`)
        //   }
        //   if (stderr) {
        //     console.log(`stderr: ${stderr}`)
        //   }
        //   console.log(`stdout: ${stdout}`)
        // })

        if (results) {
          console.log(
            `'${results.config.env.host}' cypress run done on '${results.config.projectId}'`
          )
        }
      })
    },
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: ['*/**/_debug'],
    fixturesFolder: 'cypress/fixtures',
    projectId: 'deckdle',
    screenshotsFolder: 'cypress/screenshots',
    specPattern: ['cypress/integration/**/*.cy.js'],
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 768,
    viewportHeight: 840,
    watchForFileChanges: true,
  },
  env: {
    CUSTOM_SCRIPTS_ROOT: 'scripts',
  },
  video: true,
})
