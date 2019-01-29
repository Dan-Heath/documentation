# [Codeship Documentation](https://documentation.codeship.com/) [![Codeship Status for codeship/documentation](https://codeship.com/projects/0bdb0440-3af5-0133-00ea-0ebda3a33bf6/status?branch=master)](https://codeship.com/projects/102044) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=codeship/documentation)](https://dependabot.com) 

## Contributing

We are happy to hear your feedback. Please read our [contributing guidelines](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md) before you submit a pull request or open a ticket.

If you have any questions regarding your projects on Codeship, or general features and supported workflows, please take a look at [how to get help](SUPPORT.md) instead.

## Getting Started

## Prerequisites

* [Docker](https://docs.docker.com/engine/installation/)

We recommend using Docker to build and test the documentation. Running via Docker is only required if you plan to make changes to the styling or layout of the site.

For content related changes and fixes, it's easiest to use GitHub's [File Edit UI](https://help.github.com/articles/editing-files-in-another-user-s-repository/) to make the changes and create the pull request.

### Setup

The first step is cloning and going into the repository.

```shell
git clone git@github.com:codeship/documentation.git
cd documentation
```

Then build the container and save it as a tagged image.

```shell
docker build --tag codeship/documentation .
```

You can now run commands via that container. By default, it will build the site and start the Jekyll development server.

```shell
docker run -it --rm -p 4000:4000 -v $(pwd):/docs codeship/documentation
```

To access the site open http://IP_OF_YOUR_DOCKER_SERVER:4000 in your browser. Usually, this is `localhost:4000`.

On **Windows**, the Docker commands are executed via the Docker Quickstart Terminal. If localhost doesn't work, you might have to open a normal command prompt and type `docker-machine ls`. There you can take the IP that is listed under URL and type the IP (with port 4000) into your browser to reach the documentation.

## Development

### Updating dependencies

To update Rubygem based dependencies, update the `Gemfile` (if required) and run

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation bundle lock --update
```

For NPM based dependencies, run the following two commands

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation yarn upgrade
```

### Spellcheck

To run spellcheck on all Markdown files, run the following command:

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation yarn run check
```

To run the interactive correction functionality and to update the .spelling file, run:

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation yarn run fix
```

See output and [mdspell](https://github.com/lukeapage/node-markdown-spellcheck) for details on how to maintain the `.spelling` file.

### Linting

#### SCSS

SCSS files are automatically linted using [scss-lint](https://github.com/causes/scss-lint). To run it, execute the following command

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation bundle exec scss-lint
```

It's configured in [.scss-lint.yml](.scss-lint.yml) and the default configuration is [available online](https://github.com/causes/scss-lint/blob/master/config/default.yml) as well.

#### JSON

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation gulp lint
```

#### Jekyll

```shell
docker run -it --rm -v $(pwd):/docs codeship/documentation bundle exec jekyll doctor
```

## Markup

### Table of contents

If you want to include a table of contents, include the following snippet in the markdown file

```md
* include a table of contents
{:toc}
```

### URL Helpers
#### Tags

Generate a URL for the specified tag (_database_ in the example below). This function is also available as a filter and can be used with a variable (_tag_ in the example).

```
{% tag_url databases %}
{{ tag | tag_url }}
```

generates the output as follows (depending on configuration values):

```
/tags/databases/
```

#### Man Pages

Link to a particular Ubuntu man page. The Ubuntu version currently defaults to Ubuntu Trusty.

```
{% man_url formatdb %}
```

generates the following output:

```
http://manpages.ubuntu.com/manpages/trusty/en/man1/formatdb.1.html
```

#### Notes

You can include `note` sections on the pages via the `csnote` helper. Those blocks are powered by the [Shipyard Notes component](https://codeship.github.io/shipyard/components/notes)

```
{% csnote info %}
Some informational text.
{% endcsnote %}
```

As an optional argument you can specify either `info`, `success` or `warning`. If you don't specify the argument a default (grey) note will be used.
