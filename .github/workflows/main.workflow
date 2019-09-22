workflow "Test and deploy on push" {
  on = "push"
  branches = [
      "master"
  ]
  resolves = ["GitHub Action for npm"]
}

action "Setup Node.js for use with actions" {
  uses = "actions/setup-node@e565252a9dec30354d1b3507ab733e40b9580cc9"
}

action "test" {
  uses = "run"
  needs = ["Setup Node.js for use with actions"]
  args = "yarn install && yarn test"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["test"]
  args = "npm publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
