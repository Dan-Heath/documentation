---
title: Keeping Build Artifacts After CI/CD
shortTitle: Build Artifacts
menus:
  basic/ci:
    title: Artifacts
    weight: 5
tags:
  - cdn
  - artifacts
  - testing
categories:
  - Continuous Integration
  - Caching
redirect_from:
  - /continuous-integration/keep-build-artifacts/
---

* include a table of contents
{:toc}

For security reasons Codeship does not provide persistent storage of files between builds (aside from the build log). If you wish to retain artifacts for troubleshooting purposes, then you will need to implement steps to transfer them to a remote server during the build run.

## Upload artifacts to S3

If you want to upload artifacts to S3 during your test steps, you can use the [AWS CLI]({{ site.baseurl }}{% link _basic/continuous-deployment/deployment-with-awscli.md %}). First add the following environment variables to your project configuration:

```
AWS_DEFAULT_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

Then add the following commands to your setup/test steps:

```shell
pip install awscli
aws s3 cp your_artifact_file.zip s3://mybucket/your_artifact_file.zip
```

{% csnote info %}
For Codeship Pro, our [Codeship AWS container]({{ site.baseurl }}{% link _pro/continuous-deployment/aws.md %}) can be implemented to transfer artifacts to S3 storage.
{% endcsnote %}

For more advanced usage of the S3 CLI, please see Amazon's [S3 documentation](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html).

**Note** that you can simply add another [integrated S3 deployment]({{ site.baseurl }}{% link _basic/continuous-deployment/deployment-to-aws-s3.md %}) after your actual deployment if you only want to keep artifacts for specific branches.

## Upload through SFTP

Each project has its own [SSH public key]({{ site.baseurl }}{% link _general/projects/project-ssh-key.md %}) which you'll find under _Project Settings > General_. You can use this key to grant access to your storage provider for Codeship or [upload files through SFTP]({{ site.baseurl }}{% link _basic/continuous-deployment/deployment-with-ftp-sftp-scp.md %}).
