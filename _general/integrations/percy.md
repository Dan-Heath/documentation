---
title: Integrating CodeShip With Percy Visual Testing
shortTitle: Using Percy Visual Testing
tags:
  - screenshots
  - visual testing
  - browsers
  - browser testing
  - integrations
categories:
  - Integrations  
menus:
  general/integrations:
    title: Using Percy
    weight: 5
redirect_from:
  - /basic/continuous-integration/percy-basic/
  - /pro/continuous-integration/percy-docker/
---

* include a table of contents
{:toc}

<div class="warning-block">
Because we don't have a pull request identifier environment variable, the Percy integration is limited in it's ability to generate screenshot comparisons over time.
</div>

## About Percy

[Percy](https://percy.io) is a visual testing tool that lets you take screenshots, monitor visual changes, and require team approval to these visual captures in an automated way as part of your CI/CD pipeline.

By using Percy you can easily test your UI without complex browser testing overhead.

[Their documentation](https://percy.io/docs) does a great job of providing more information, in addition to the setup instructions below.

## CodeShip Pro

### Setting Your Percy Variables

You will need to add a value that Percy provides when you create a new project inside their application - `PERCY_TOKEN` - to the [encrypted environment variables]({{ site.baseurl }}{% link _pro/builds-and-configuration/environment-variables.md %}) that you  encrypt and include in your [codeship-services.yml file]({{ site.baseurl }}{% link _pro/builds-and-configuration/services.md %}).

### Static Sites

To use Percy with static sites inside Docker images on CodeShip Pro, you will need to install the `percy-cli` gem inside your images, either as part of a Gemfile or by adding the following command to the Dockerfile:

```dockerfile
RUN gem install percy-cli
```

**Note** that this will require you to be building an image that contains both Ruby and Rubygems. If the image does not contain both of these, you will be unable to install the necessary `percy-capybara` gem.

From there, you will need to add the following command as a step or inside of a script in your [codeship-steps.yml file]({{ site.baseurl }}{% link _pro/builds-and-configuration/steps.md %}):

```yaml
- service: your_service
  command: percy snapshot directory_to_snapshot
```

Note that you can use multiple commands to take snapshots of multiple directories, and that the directories **must contain HTML files**.

### Ruby

To integrate Percy with CodeShip Pro on a Ruby and Docker project, you will want to install the you will need to install the `percy-capybara` gem inside your images, either as part of a Gemfile or by adding the following command to the Dockerfile:

```dockerfile
RUN gem install percy-capybara
```

**Note** that this will require you to be building an image that contains both Ruby and Rubygems. If the image does not contain both of these, you will be unable to install the necessary `percy-cli` gem.

From there, you will need to add specific hooks to your Rspec, Capybara, Minitest, or any other test specs you may have. You can find specific instructions for calling Percy from your test specs [at the Percy documentation](https://percy.io/docs/clients/ruby/capybara-rails).

These test specs will be called via your [codeship-steps.yml file]({{ site.baseurl }}{% link _pro/builds-and-configuration/steps.md %}).

### Ember

To integrate Percy with CodeShip Pro on an Ember and Docker project, you will want to install the `ember-percy` package into your application, typically via your `package.json`.

From there, you will need to add specific hooks in to your project's test specs. You can find specific instructions for calling Percy from your test specs [at the Percy documentation](https://percy.io/docs/clients/javascript/ember).

These test specs will be called via your [codeship-steps.yml file]({{ site.baseurl }}{% link _pro/builds-and-configuration/steps.md %}).

## CodeShip Basic

### Setting Your Percy Variables

You will need to add a value that Percy provides when you create a new project inside their application - `PERCY_TOKEN` - to your project's [environment variables]({{ site.baseurl }}{% link _basic/builds-and-configuration/set-environment-variables.md %}).

You can do this by navigating to _Project Settings_ and then clicking on the _Environment_ tab.

![Configuration of Percy env vars]({{ site.baseurl }}/images/continuous-integration/percy-env-vars.png)

### Static Sites

To use Percy with static sites on CodeShip Basic, you will need to install the `percy-cli` gem, either in your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}) or in your `Gemfile` itself. You can install the gem with the command:

```shell
gem install percy-cli
```

From there, you will need to add the following command to your [test commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}):

```shell
percy snapshot directory_to_snapshot
```

Note that you can use multiple commands to take snapshots of multiple directories, and that the directories **must contain HTML files**.

### Ruby

To integrate Percy with CodeShip Basic on a Ruby project, you will want to install the `percy-capybara` gem in either your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}) or your Gemfile. You can install the gem with the command:

```shell
gem install percy-capybara
```

From there, you will need to add specific hooks to your Rspec, Capybara, Minitest, or any other test specs you may have. You can find specific instructions for calling Percy from your test specs [at the Percy documentation](https://percy.io/docs/clients/ruby/capybara-rails).

### Ember

To integrate Percy with CodeShip Basic on an Ember project, you will want to install the `ember-percy` package by adding the following to your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}):

```shell
ember install ember-percy
```

From there, you will need to add specific hooks in to your test specs. You can find specific instructions for calling Percy from your test specs [at the Percy documentation](https://percy.io/docs/clients/javascript/ember).
