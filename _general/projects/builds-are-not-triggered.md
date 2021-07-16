---
title: Troubleshooting Issues With Builds Not Starting
shortTitle: Builds Not Starting
menus:
  general/projects:
    title: Builds Not Starting
    weight: 6
tags:
  - troubleshooting
  - build error
  - github
  - bitbucket
  - gitlab
  - git
categories:
  - Projects
  - Configuration
  - Account
redirect_from:
  - /troubleshooting/builds-are-not-triggered/
  - /faq/builds-are-not-triggered/
---

* include a table of contents
{:toc}

{% csnote info %}
If your builds are not triggering on CodeShip, it is possible we are experiencing a service interruption. Be sure to check our [status page](https://www.codeshipstatus.com) to monitor any potential issues. You can also follow the [@CodeShipStatus](https://twitter.com/codeshipstatus) Twitter account.
{% endcsnote %}

## Webhooks

Builds on CodeShip are triggered via a webhook from your source control repository. This webhook is added to your repository when you connect the project to CodeShip, but sometimes those settings get out of sync.

Depending on your SCM, the process to fix this is a bit different.

### GitHub

Make sure the CodeShip GitHub app is installed on your GitHub organization that owns the repository for your project. You also need to ensure that the CodeShip GitHub app is allowed to access the repository. To update your CodeShip GitHub app, go to your GitHub _Organization Settings_ and select the _Installed GitHub Apps_ menu. If the CodeShip GitHub app is not installed it will not show up; if it is installed click the _Configure_ button to update the list of allowed repositories.

![Github Apps Configuration]({{ site.baseurl }}/images/general/github_apps_configuration.png)

#### Reinstall GitHub App

To reset the installation, you can uninstall and reinstall the app. Under the same _Configure_ page as above, scroll to the bottom and click the _Uninstall_ button. Once GitHub finishes removing the app, you can [install](https://github.com/apps/cloudbees/installations/new) it in your organization again.

### GitLab

Make sure a webhook for CodeShip is added under the _Webhooks_ section in the settings of your repository. The [GitLab documentation](https://docs.gitlab.com/ce/user/project/integrations/webhooks.html) has more information.

### Bitbucket

Make sure a webhook for CodeShip is added under the _Webhooks_ section in the settings of your repository. Please also check the UUID in the hook URL matches the UUID from your project. The hook URL itself should match the following pattern.

```
https://lighthouse.codeship.io/bitbucket_v2/YOUR_PROJECT_UUID
```

![BitBucket Webhooks Configuration]({{ site.baseurl }}/images/general/bitbucket_webhooks.jpg)

### Verifying Branches Aren't Excluded

Because you can use the _Branches_ tab in your _Project Settings_ to exclude certain branches from running builds, or to only run builds on certain branches, you should verify that your branches are not excluded if you are seeing builds fail to trigger.

![Exclude branches from running builds]({{ site.baseurl }}/images/general/exclude_branches.png)
