---
title: Using Ruby In CI/CD with CodeShip Basic
shortTitle: Ruby
menus:
  basic/languages:
    title: Ruby
    weight: 1
tags:
  - ruby
  - jruby
  - languages
  - rails
  - sinatra
  - rvm
  - bundler
categories:
  - Languages And Frameworks
redirect_from:
  - /languages/ruby/
  - /general/projects/could-not-find-gemname-in-any-of-the-sources/
---

* include a table of contents
{:toc}

## Versions And Setup

### RVM
We use [RVM](https://rvm.io) to manage different [Ruby](https://www.ruby-lang.org/en) and [JRuby](https://www.jruby.org) versions. We set **{{ site.data.basic.defaults.ruby }}** as the default version. Currently we do not automatically load the Ruby version from your Gemfile. You can always change the Ruby version by running:

```shell
rvm use RUBY_VERSION_YOU_WANT_TO_USE --install
```

Most Ruby versions are preinstalled, but if you need an older version the `--install` flag will automatically install the version for you at build time.

The following Ruby versions are preinstalled:

{% include basic/ami/{{ site.data.basic.ami_id }}/ruby.md %}

### Using a .ruby-version file
You can also use your `.ruby-version` file on CodeShip. The `.ruby-version` file lives in the project root and its content is just your Ruby version, for example: `2.7.0`. You can read the Ruby version to use from that file:

```shell
rvm use $(cat .ruby-version) --install
```

One use case is that you can change your Ruby version for different branches.

### JRuby
If you need to install a version of [JRuby](https://www.jruby.org/download) that is not already installed by default you can do so with:

```shell
rvm use jruby-JRUBY_VERSION_YOU_WANT_TO_USE --install
```

## Dependencies

You can install dependencies using [Bundler](https://bundler.io) in your [setup commands]({{ site.baseurl }}{% link _basic/quickstart/getting-started.md %}#configuring-your-setup-commands):

```shell
gem install bundler -v BUNDLER_VERSION_YOU_WANT_TO_USE
bundle install
```

In some cases you may need to update [RubyGems](https://rubygems.org) first with:

```shell
gem update --system
```

### Dependency Cache

CodeShip automatically configures bundler to use the `$HOME/cache/bundler` directory, which we save between builds to optimize build performance. You can [read this article to learn more]({{ site.baseurl }}{% link _basic/builds-and-configuration/dependency-cache.md %}) about the dependency cache and how to clear it.

## Frameworks And Testing

Our Ruby support includes Ruby itself, [Rails](https://rubyonrails.org), [Sinatra](http://sinatrarb.com) and most other frameworks.

We also support all Ruby based test frameworks like RSpec, Cucumber and Minitest.

Capybara is also [supported out of the box]({{ site.baseurl }}{% link _basic/continuous-integration/browser-testing.md %}) with the selenium-webdriver, capybara-webkit or the poltergeist driver for PhantomJS.

## Parallel Testing

If you are running [parallel test pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), you will want to separate your RSpec tests into groups and call a group specifically in each pipeline. For instance:

**Pipeline 1**:
```shell
rspec spec/spec_1
```

**Pipeline 2**:
```shell
rspec spec/spec_2
```

### Parallelization Gems

In addition to parallelizing your tests explicitly [with parallel pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), there are a couple Rails gems that are popular ways to parallelize within your codebase.

While we do not officially support or integrate with these modules, many CodeShip users find success speeding their tests up by using them. Note that it is possible for these gems to cause resource and build failure issues.

- [https://github.com/grosser/parallel_tests](https://github.com/grosser/parallel_tests)
- [https://github.com/ArturT/knapsack](https://github.com/ArturT/knapsack)


## Notes And Known Issues

### Nokogiri
Nokogiri might fail to compile with the bundled _libxml_ and _libxslt_ libraries. To install the gem you need to use the system libraries instead.

The error may look like this:

```
Fetching nokogiri 1.8.2
Installing nokogiri 1.8.2 with native extensions
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
```

Fix it by adding this command before `bundle install`:

```shell
bundle config build.nokogiri --use-system-libraries
```

### Run With Bundle Exec

Make sure to run your commands with `bundle exec` (e.g. `bundle exec rspec`) so all commands you run are executed with the versions of the Ruby gems you configured in your Gemfile.lock.

### Can Not Find Gem In Sources

Sometimes you might see errors like the following:

```
Could not find safe_yaml-0.9.2 in any of the sources
```

Please make sure the version of the gem you want to install wasn't removed from [RubyGems](https://rubygems.org/).

### RVM Requires Curl

If you are manually installing a Ruby version with RVM you may encounter the following error:

```
RVM requires 'curl'. Install 'curl' first and try again.
```

This error typically occurs when the NPM package [node-which](https://github.com/npm/node-which) is installed. You can check if it is present in the build with:

```
$ which which
node_modules/.bin/which
```

To workaround this, temporarily remove the NPM version of `which`, then run your `rvm` command. After that completes you can let the package reinstall with either `npm install` or `yarn install`. To remove it, add this command at the start of your _Setup Steps_:

```
rm -f node_modules/.bin/which
```

### Custom Bundler Version

Each preinstalled Ruby version will include a recent version of [Bundler](https://bundler.io) by default. If you have a situation where you need to install a specific Bundler version you can do so by adding the following commands to your build after setting the Ruby version:

```
gem uninstall -x -a bundler
rvm @global do gem uninstall -x -a bundler
gem install bundler -v YOUR_BUNDLER_VERSION
```

### FreeTDS

[FreeTDS](http://www.freetds.org) `1.00.82` is installed by default. If your project requires a newer version you can install it with a [script](https://github.com/codeship/scripts/blob/master/packages/freetds.sh) by adding this command to your setup steps:

```
\curl -sSL https://raw.githubusercontent.com/codeship/scripts/master/packages/freetds.sh | bash -s
```

Following the install add this command before running `bundle install`:

```
bundle config build.tiny_tds --with-freetds-lib=$HOME/cache/freetds/lib --with-freetds-include=$HOME/cache/freetds/include
```

### Puma

The [Puma gem](https://github.com/puma/puma) will fail to install by default if the version is older than 3.7. Older Puma versions use OpenSSL 1.0, but Ubuntu Bionic includes OpenSSL 1.1 by default. You can either upgrade Puma to at least 3.7 or revert to the older OpenSSL version.

The error may look like this:

```
Fetching puma 3.6.0
Installing puma 3.6.0 with native extensions
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
```

Revert to OpenSSL 1.0 by adding these commands before `bundle install`:

```
sudo apt-get update
sudo apt-get install -y libssl1.0-dev
```
