---
title: Caching Multi-stage Dockerfile
shortTitle: Caching Multi-stage Dockerfile
menus:
  pro/common-issues:
    title: Caching Multi-stage Dockerfile
    weight: 5
tags:
  - docker
  - pro
  - cache

categories:
  - Common Issues

---

Because CodeShip Pro only caches image layers of the final Dockerfile stage, artifacts copied into the final stage may continually invalidate subsequent cache layers.

In our contrived Dockerfile, we have a multi-stage build:

```yaml
# Dockerfile

FROM ubuntu:xenial as stage-one
COPY ./artifact-materials .
RUN ./make-artifact.sh

FROM ubuntu:xenial as app
COPY --from=stage-one ./artifact.sh ./artifact.sh
RUN ./time-consuming-build-process.sh
COPY . .
```

Our recommendation would be to split the stages into separate services:

```yaml
# Dockerfile.stage-one

FROM ubuntu:xenial

COPY ./artifact-materials .
RUN ./make-artifact.sh
```

```yaml
# Dockerfile.final

FROM stage-one as stage-one

FROM ubuntu:xenial

COPY --from=stage-one ./artifact.sh ./artifact.sh
RUN ./time-consuming-build-process.sh
COPY . .
```

```yaml
# codeship-services.yml

stage-one:
  build:
    dockerfile: Dockerfile.stage-one
    image: stage-one # assert image name to prevent `codeship_` prefix from being applied
  cached: true

app:
  build:
    dockerfile: Dockerfile.final
  cached: true
```

```yaml
# codeship-steps.yml

- name: build stage-one first in order to be available for `app` docker build
  service: stage-one
  command: true

- service: app
  command: ./run-tests.sh
```

<br />
