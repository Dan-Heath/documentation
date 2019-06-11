---
title: Using Node.js In CI/CD with CodeShip Basic
shortTitle: Node.js
menus:
  basic/languages:
    title: Node.js
    weight: 2
tags:
  - node
  - nodejs
  - iojs
  - npm
  - yarn
  - bower
  - framework
  - javascript
  - languages
categories:
  - Languages And Frameworks
redirect_from:
  - /languages/nodejs/
---

* include a table of contents
{:toc}

{% csnote info %}
This article is about using Node.js with CodeShip Basic.

If you'd like to learn more about CodeShip Basic, we recommend the [getting started guide]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}) or [the features overview page](https://codeship.com/features/basic)
{% endcsnote %}

## Versions And Setup

We use **nvm** to manage different Node.js versions. We read the Node.js version you set in your **package.json** and install the appropriate one. You can use **nvm** in your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}), such as:

```shell
nvm install NODE_VERSION
```

If the version isn't already pre-installed on the build VMs `nvm` will download the version from the official repositories and make it available to your build.

### Default Version

The default version when we can't find a setting in your `package.json` is the latest version of the `10` release.

### Pre-installed versions
The latest versions of the following [Node.js releases](https://nodejs.org/en/download/releases) are pre-installed on our build VMs: `4.x`, `5.x`, `6.x`, `7.x`, `8.x`, `9.x`, `10.x` and `11.x`.

Please note that we only install the latest version for each of those releases. You can however install any custom version via the `nvm install` command mentioned above.

## Dependencies

You can use npm to install your dependencies. We set the `$PATH` to include the `node_modules/.bin` folder so all executables installed through npm can be run.

If you have a npm version specified in your `package.json` file, it won't get picked up by *nvm* automatically. Please include the following snippet in your setup steps to install the specified version.

```shell
npm install --global npm@"$(jq -r '.engines.npm' package.json)"
```

If you simply want to upgrade `npm` to the latest available version add the following command to your setup steps.

```shell
npm install -g npm@latest
```

### npm Private Modules

In order to use private NPM modules, you'll need to login on your local machine and take a look at your `~/.npmrc` file. You'll find a registry URL as well as an authentication token.

`~/.npmrc` file example:

```shell
//localhost:4873/:_authToken="Pfd0FZsrT89l5xyJmB/3Lg=="
```

Once you have these, configure them as environment variables in your **Project Settings** > **Environment** page

![npm Private Module Environment Variables]({{ site.baseurl }}/images/languages/npm-private-env-var.jpeg)

+Add the following script to the _Setup Commands_ section of your test configuration.

```shell
echo "//${REGISTRY_URL}/:_authToken=${AUTH_TOKEN}" > "${HOME}/.npmrc"
```

### Dependency Cache

CodeShip automatically caches the `$REPO_ROOT/node_modules` directory between builds to optimize build performance. You can [read this article to learn more]({{ site.baseurl }}{% link _basic/builds-and-configuration/dependency-cache.md %}) about the dependency cache and how to clear it. We also configure `yarn` to write into `$HOME/cache/yarn`, which is also cached.

### Caching Globally Installed Dependencies

If you want to cache packages installed via the `-g` switch as well, please add the following command to your setup steps.

```shell
npm config set cache "${HOME}/cache/npm/"
export PATH="${HOME}/cache/npm/bin/:${PATH}"
export PREFIX="${HOME}/cache/npm/"
```

### Scoped Packages

{% csnote info %}
Scoped packages are only available for versions of `npm` greater than 2.7.0.
{% endcsnote %}

To create a scoped package, you simply use a package name that starts with your scope.

```json
{
  "name": "@username/project-name"
}
```

If you use `npm init`, you can add your scope as an option to that command.

```shell
npm init --scope=username
```

If you use the same scope all the time, you will probably want to set this option in your `~/.npmrc` file.

```shell
npm config set scope username
```

### Yarn

You can also use [Yarn](https://yarnpkg.com/en) to install your dependencies as an alternative to npm. Yarn 1.9.4 is pre-installed on the build VMs and requires your project to use Node.js 4.0 or higher.

If you want to [install the latest version of Yarn](https://yarnpkg.com/en/docs/install#alternatives-tab), there are several ways to do it, including:

```
curl -o- -L https://yarnpkg.com/install.sh | bash

export PATH="$HOME/.yarn/bin:$PATH"
```

You can also [install specific versions or use npm](https://yarnpkg.com/en/docs/install#alternatives-tab).

### Bower

You can also use [Bower](https://bower.io) for working with dependencies. To install the latest version add this step to your build:

```
npm install -g bower
```

Note that the Bower project recommends [migrating to Yarn](https://bower.io/blog/2017/how-to-migrate-away-from-bower) as an alternative to Bower.

### Webpack

You can install webpack via NPM, as seen below:

```shell
npm install webpack
```

**Note** that you may need to specify a specific version of Node.js via `nvm` to use webpack successfully.

## Parallel Testing

If you are running [parallel test pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), you will want separate your tests into groups and call a group specifically in each pipeline. For instance:

**Pipeline 1:**
```shell
mocha tests/test_1.js
```

**Pipeline 2:**
```shell
mocha tests/test_2.js
```

### Parallelization Modules

In addition to parallelizing your tests explicitly [via parallel pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), some customers have found using the [mocha-parallel-tests npm](https://www.npmjs.com/package/mocha-parallel-tests) is a great way to speed up your tests.

Note that we do not officially support or integrate with this module and that it is possible for this to cause resource and build failure issues, as well.

## Notes And Known Issues

Due to Node.js version issues, you may find it helpful to test your commands with different versions via an [SSH debug session]({{ site.baseurl }}{% link _basic/builds-and-configuration/ssh-access.md %}) if tests are running differently on CodeShip compared to your local machine.

### Running grunt

Do not run `npm test` to execute grunt tests. When a grunt test fails, it will return a non-zero exit code to `npm`. `npm` will ignore this exit code and return with an exit code of zero. We determine the status of your test commands based on the exit code of that command. An exit code of zero will make the command succeed, even if your tests failed.

Instead of `npm test` run your test commands directly via `grunt` using the following command.

```shell
grunt test
```

## Frameworks And Testing

All versions of Node.js run on CodeShip. Additionally, all tools and test frameworks, such as karma, mocha, grunt or any other node-based tool should work without issue. You will need to be sure to install them via `npm` before using them, however.

### io.js

If you want to use [io.js](https://iojs.org/) simply add the following step to your setup commands.

```shell
nvm use iojs-v3
```

You can then either use the `node` or the `iojs` binary to run your applications.

If you want to us a more specific version you need to add the following steps to your setup commands:

```shell
export NVM_IOJS_ORG_MIRROR="https://iojs.org/dist"
nvm install "$(jq -r '.engines.node' package.json)"
```

Combined with setting the engine to e.g `iojs-v1.5.1` this installs and selects the required version.
