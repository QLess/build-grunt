# @qless/build-grunt

This is the common build system for QLess' Grunt based projects

## Install
`npm install --save-dev @qless/build-grunt`

This will install the module in the project. It comes with a custom `grunt`
binary that only runs the commands below. This was done for backwards
compatibility until these projects are migrated to a more modern build.

## Configuration

By default, other than installing the module, there is no additional configuration needed.

To copy extra files (probably should get rid of those...), add a property to
the project's `package.json` file called `buildCopy`. It should be an array of glob string patterns relative to the root of the site.

## Usage

## Simple

`npx grunt`

Runs the development grunt build for local testing only.

## All Options

### Assets Commands

`npx grunt css` `npx grunt assets` `npx grunt html`

These are the small tasks that build up each asset of the app. They
should not really be ran by themselves.

### Compile Command

`npx grunt compile`

This task compiles together all the assets commands and puts them in the dist
folder

### Build Commands

`npx grunt build` `npx grunt buildprod`

These produce the final output WAR files. The difference is that `build` is for
local development only.

`buildprod` produces a version suitable for deploying to test envs and
production **but only if used after `bump`**. As such, it should not be used
on its own but is included here to build a sample to that can be used to test
what will get deployed. `npx grunt publish` should be used instead

### Deploy the project

`npx grunt publish`

Bumps the project version and then builds a WAR file that can be deployed to
the different environments.

By default, it will do a patch version. To use a minor or major, add `--bumpType=minor|major` after the task name.

`npx grunt deploy`

Builds a local suitable WAR file and then copies it to the host computer's
local JBoss install. Left in purely for backwards compat.
