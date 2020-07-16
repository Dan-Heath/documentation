---
title: Using PHP In CI/CD with CodeShip Basic
shortTitle: PHP
menus:
  basic/languages:
    title: PHP
    weight: 3
tags:
  - php
  - languages
  - cakephp
  - laravel
categories:
  - Languages And Frameworks
redirect_from:
  - /languages/php/
---

* include a table of contents
{:toc}

## Versions And Setup

We use **PHPENV** to manage PHP versions. We currently have **5.6**, **7.0**, **7.1**, **7.2**, **7.3** and **7.4** installed.
These are aliases that are pointing to the specific 5.x.x and 7.x.x versions we have installed.

For a full list of installed versions (including patch level versions) open a SSH debug build and run the following command

```shell
phpenv versions
```

### Ubuntu 18.04
By default we use {{ site.data.basic.defaults.php }}

Specific versions: 5.6.40, 7.0.33, 7.1.33, 7.2.31, 7.3.19 and 7.4.7

***Do not rely on the specific versions we have as this can change at any time and could break your build.***

You can change the version you want to use by running `phpenv local PHP_VERSION` in your setup commands.
For example

```shell
phpenv local 7.3
```

### PHP.ini

You can access and change the php.ini file in

```shell
/home/rof/.phpenv/versions/$(phpenv version-name)/etc/php.ini
```

### phpenv Rehashing

If you install a new executable through a pear package make sure to run

```shell
phpenv rehash
```

so phpenv is aware of the new executable and sets it up correctly

## Dependencies

You can install dependencies through pear and composer in your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}).

For example:

```shell
composer install
```

### Dependency Cache

If you want cache `composer` dependencies during builds, please add the following environment variable to your build configuration.

```shell
COMPOSER_HOME=${HOME}/cache/composer
```

To make sure that the dependency cache is used by all of your dependencies, please call `composer` via the following snippet.

```shell
composer install --prefer-dist  --no-interaction
```

### Extensions

Extensions can be installed through pecl. If you need any other tools or are having trouble getting an extension to build, [please send us a message](https://helpdesk.codeship.com).

### xdebug

By default `xdebug` is installed and enabled on the build VMs. If you want to remove it, add the following command to your builds.

```shell
rm -f /home/rof/.phpenv/versions/$(phpenv version-name)/etc/conf.d/xdebug.ini
```

### Pear

```shell
pear install pear/PHP_CodeSniffer
```

### Composer

```shell
composer install --no-interaction
```

### Pecl

```shell
pecl install -f memcache
```

### GitHub API

To speed up Composer you can install packages from `dist` by replacing `--prefer-source` with `--prefer-dist`. However as GitHub's API is rate limited, you then might see errors similar to this:

```shell
- Installing phpunit/phpunit (3.7.37)
Downloading: connection... Failed to download phpunit/phpunit from dist: Could not authenticate against github.com`
Now trying to download from source
```

To avoid this create a [new personal access token on GitHub](https://github.com/settings/tokens/new). For the description you can use something like _CodeShip Composer_ and you can unselect all scopes. Copy your personal access token and add it to the environment variables in your CodeShip project settings (on the _Environment_ page) as `GITHUB_ACCESS_TOKEN`.

Then use the following Setup Commands in your CodeShip project settings:

```shell
composer config -g github-oauth.github.com $GITHUB_ACCESS_TOKEN
composer install --prefer-dist --no-interaction
```

## Frameworks And Testing

CodeShip supports essentially all popular PHP frameworks, such as Laravel, Symfony, CodeIgniter and CakePHP.

Additionally, all testing frameworks, such as phpunit and codeception, will work on CodeShip.

## Parallel Testing

If you are running [parallel test pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), you will want separate your tests into groups and call a group specifically in each pipeline. For instance:

**Pipeline 1:**
```shell
phpunit tests/tests_1
```

**Pipeline 2:**
```shell
phpunit tests/tests_2
```

### Parallelization Modules

In addition to parallelizing your tests explicitly [via parallel pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), some customers have found using the [paratest](https://github.com/brianium/paratest) module is a great way to speed up your tests.

Note that we do not officially support or integrate with this module and that it is possible for this to cause resource and build failure issues, as well.

## Notes And Known Issues

- When setting environment variables with PHP, the syntax can be either `$_ENV["VAR_NAME"]` or `$varname`. Individual frameworks may have their own formatting. For instance, [Symfony](https://symfony.com/doc/current/index.html) uses `%env(VAR_NAME)%` for environment variables in configuration files, such as database configuration.

- Due to PHP version issues, you may find it helpful to test your commands with different versions via an [SSH debug session]({{ site.baseurl }}{% link _basic/builds-and-configuration/ssh-access.md %}) if tests are running differently on CodeShip compared to your local machine.

### Running your PHP Server

If you want to test against a running PHP Server you can use the builtin one to
start a server in the current directory. It will serve files from this directory.

```shell
nohup bash -c "php -S 127.0.0.1:8000 2>&1 &" && sleep 1; cat nohup.out
```

You can access it in your tests on 127.0.0.1:8000.

Also take a look at the PHP built-in webserver docs in the
[PHP documentation](https://secure.php.net/manual/en/features.commandline.webserver.php)

### Exiting Tests

All commands must return an `exit code 0` to CodeShip to report a successful result, or any other error code to report an unsuccessful result. This means you must configure your test scripts to exit with a `0` status if they do not do so by default.

### Custom PHPUnit Version

Note that if you need to install a custom version of PHPUnit, you can do so with the following commands:

```shell
composer global remove phpunit/phpunit
composer global require phpunit/phpunit:7.*
```

### Memcached

If you need to install the [Memcached extension](https://pecl.php.net/package/memcached) for PHP 7 and up you may need to use this command to get it installed:

```
printf "/usr \n\n\n\n\n\n\nno\n" | pecl install memcached
```

### libsodium

If your project requires [libsodium](https://libsodium.org) you can install it with a [script](https://github.com/codeship/scripts/blob/master/packages/libsodium.sh) by adding this command to your setup steps:

```
\curl -sSL https://raw.githubusercontent.com/codeship/scripts/master/packages/libsodium.sh | bash -s
```

Following the install add this command to install with `pecl`:

```
LD_LIBRARY_PATH=$HOME/cache/libsodium/lib PKG_CONFIG_PATH=$HOME/cache/libsodium/lib/pkgconfig LDFLAGS="-L$HOME/cache/libsodium/lib" pecl install libsodium
```
