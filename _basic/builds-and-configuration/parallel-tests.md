---
title: Speed Up Your Builds With Parallel Testing on Codeship Basic
shortTitle: Parallel Testing
menus:
  basic/builds:
    title: Parallel Testing
    weight: 5
tags:
  - testing
  - continuous integration
  - parallelci
  - parallelism
  - speed
  - parallel
  - concurrency
categories:
  - Builds and Configuration
  - Continuous Integration
  - Testing
redirect_from:
  - /continuous-integration/parallelci/
  - /basic/getting-started/parallelci/
  - /classic/getting-started/parallelci/
  - /basic/builds-and-configuration/parallelci/
---

{% csnote info %}
Parallel test pipelines are an account upgrade. You can try [a free trial](https://codeship.com/projects#start-trial) to test using up to 20 parallel test pipelines for two weeks on all your projects.
{% endcsnote %}

* include a table of contents
{:toc}

## What Are Parallel Test Pipelines?

Parallel test pipelines allow you to split your test commands across multiple test pipelines to speed up your build time.

**Note** that all test pipelines run on separate build VMs to avoid the possibility of race conditions or resource limitations.

## Using Parallel Test Pipelines

Once parallel test pipelines are enabled, each project can have multiple **test pipelines** that will be run in parallel. Codeship will first run your setup commands and then any arbitrary _test commands_ you defined for this specific pipeline via the interface.

To ease distinguishing different pipelines you can provide a name for each one.

![Configuration of test pipelines]({{ site.baseurl }}/images/continuous-integration/parallelization-test-pipelines-configuration.png)

### Restarting Individual Pipeline

If a pipeline fails, you can restart only that individual pipeline by hovering over the failed pipeline's status indicator.

![Restarting test pipeline]({{ site.baseurl }}/images/continuous-integration/restart-pipelines.png)

### Disabling Parallel Test Pipelines

You can either delete additional test pipelines, or comment out any commands by prepending a `#` symbol to each line. A test pipeline is only active if it contains at least one command.

### Deployment Pipeline

Using parallel test pipelines is unrelated to creating your deployment pipelines, which are specific to deploying your application at the end of your tests and can **not** run in parallel.

You can [learn more about deployment pipelines here.]({{ site.baseurl }}{% link _basic/builds-and-configuration/deployment-pipelines.md %})

{% csnote info %}
When using a single test pipeline, the same build container is used for the entire build and deploy so any configuration done during the setup and testing phase will also be present for the deployment phase. When using multiple test pipelines, a new container is used for the deploy and setup commands do not run again. If your deployment has any specific dependencies you will want to include those commands with your deployment steps.
{% endcsnote %}

### Artifacts Support

As your build and deployment commands are run on multiple virtual machines, **artifacts created during the test steps will not be available during the deployment**. If you need artifacts from the previous steps, make sure to regenerate them during the deployment using a [_script deployment_]({{ site.baseurl }}{% link _basic/continuous-deployment/deployment-with-custom-scripts.md %}) added before the actual deployment.

### Account Downgrade Behavior

If you downgrade to a subscription with fewer parallel pipelines, any additional pipelines will be automatically merged into the first pipeline on the project.

If this is not desirable for your project make sure to manually move the steps to the appropriate test pipelines before downgrading.

### Parallel Modules

In addition to parallelizing explicitly with parallel pipelines, most popular frameworks offer modules that you can install to parallelize within the codebase itself.

While we do not officially support or integrate with any of these modules, many Codeship users find success speeding their tests up by using them. Note that in many cases these modules create additional strain on your machine resource usage, so you will want to keep an eye on this as misconfiguration can result in a resource max out that ultimately slows your builds down or causes failures.

**Rails**
- [https://github.com/grosser/parallel_tests](https://github.com/grosser/parallel_tests)
- [https://github.com/ArturT/knapsack](https://github.com/ArturT/knapsack)

**Node**
- [https://www.npmjs.com/package/mocha-parallel-tests](https://www.npmjs.com/package/mocha-parallel-tests)
- [https://www.npmjs.com/package/mocha-pipelines](https://www.npmjs.com/package/mocha-pipelines)

**PHPUnit**
- [https://github.com/brianium/paratest](https://github.com/brianium/paratest)
