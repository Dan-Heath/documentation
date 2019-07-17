---
title: Environment Variables On CodeShip Basic
shortTitle: Environment Variables
menus:
  basic/builds:
    title: Environment Variables
    weight: 2
tags:
  - secrets
  - environment variables
  - variables
  - environment
categories:
  - Builds and Configuration
  - Configuration
  - Security
redirect_from:
  - /continuous-integration/set-environment-variables/
  - /basic/getting-started/set-environment-variables/
---

* include a table of contents
{:toc}

## Environment Variables On CodeShip Basic

For most applications, you will need to set environment variables to be passed in your project's build so that build steps, tests and deployments can all run successfully.

On CodeShip Basic, this can be done either through your project's *Project Settings* screen or through exporting environment variables during your setup or test commands. Additionally, we provide a set of pre-populated, global environment variables with information related to your build and the commit that triggered it.

## Environment Page on Project Settings

On the ***Environment*** page of your project settings you can enter the variable name and values into the corresponding fields.

![Environment Settings page]({{ site.baseurl }}/images/continuous-integration/environment-variables.png)

We will export these environment variables to the environment your build runs via a command similar to:

```shell
export VARIABLE_NAME="value"
```

Single (`'`) and double quotes (`"`), as well as backticks (`` ` ``) in the _value_ part of your variable are automatically escaped by prepending them with a backslash (`\`). Other characters with a special meaning (e.g. `$`) are not escaped automatically to allow you to use them with your environment variables. (For example to include the value of another variable.)

We export your environment variables before all other commands of your build. This is pure convenience for setting up the environment but completely equal to exporting environment variables yourself.

### Directly in Setup or Test Commands

You can also export environment variables in your setup or test commands. So, for example, you could enter the following setup commands:

```shell
rvm use 2.0.0
export RAILS_ENV="test"
bundle install
```

There is no difference between setting ***RAILS_ENV*** like this and adding it on the ***Environment*** page of your project settings. The advantage of putting it into the environment configuration is that secret values will not show up in your build log.

### Default Environment Variables

By default, CodeShip populates a list of CI/CD related environment variables, such as the branch and the commit ID.

The environment variables CodeShip populates are:

```
CI                     # Always true. Ex: true
CI_BRANCH              # The branch name of the triggered build. Ex: master
CI_BUILD_NUMBER        # The specific CodeShip build number, correlates to the number in the build URL.
CI_BUILD_URL           # The URL for the specific build. Ex: https://app.codeship.com/projects/*project_id*/builds/*build_number*
CI_COMMITTER_EMAIL     # The committer's email address as set in the git commit.
CI_COMMITTER_NAME      # The committer's name as set in the git commit.
CI_COMMITTER_USERNAME  # The committer's SCM username. NOTE: For BitBucket users this is the nickname field.
CI_COMMIT_ID           # The HEAD commit ID of the triggered build.
CI_MESSAGE             # The commit message set in the git commit. If the commit message is especially long, only the end of the message will be displayed.
CI_NAME                # Always CodeShip. Ex: codeship
CI_PR_NUMBER           # The pull request number associated with the build. This value is blank if the build was triggered on a commit, merge, or tag.
CI_PULL_REQUEST        # The URL of the pull request associated with the build. The value is false if the build was triggered on a commit, merge, or tag.
CI_REPO_NAME           # The name of the corresponding SCM repository.
```
