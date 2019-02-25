---
title: Using Java And The JVM In CI/CD with Codeship Basic
shortTitle: Java And The JVM
tags:
  - java
  - clojure
  - groovy
  - kotlin
  - scala
  - languages
  - jvm
  - jdk
  - openjdk
  - jre
  - oracle
  - junit
  - jce
  - sdkman
menus:
  basic/languages:
    title: Java And JVM
    weight: 7
categories:
  - Languages And Frameworks
redirect_from:
  - /languages/java-and-jvm-based-languages/
---

* include a table of contents
{:toc}

## Versions And Setup

### JDKs

The following JDKs are installed:

* OpenJDK 8
* Oracle JDK 7
* Oracle JDK 8
* Oracle JDK 9

We provide the function `jdk_switcher`, available as a setup command, to choose the JDK for your builds.
This function can take one of two commands, `use` or `home`:

* `use` will select the given JDK by changing the java executables, and setting JAVA_HOME and JRE_HOME.
* `home` will print out the value of JAVA_HOME for a given JDK (but make no modifications).

The valid values for `use` or `home` are _openjdk8_, _oraclejdk7_, _oraclejdk8_ and _oraclejdk9_.
By default, OpenJDK 8 is selected. The following is the resulting Java version, JAVA_HOME, and JRE_HOME for each JDK:

### OpenJDK 8 (Default)

```shell
jdk_switcher home openjdk8
# /usr/lib/jvm/java-8-openjdk-amd64
jdk_switcher use openjdk8
echo $JAVA_HOME
# /usr/lib/jvm/java-8-openjdk-amd64
echo $JRE_HOME
# /usr/lib/jvm/java-8-openjdk-amd64/jre
java -version
# openjdk version "1.8.0_191"
# OpenJDK Runtime Environment (build 1.8.0_191-8u191-b12-2ubuntu0.18.04.1-b12)
# OpenJDK 64-Bit Server VM (build 25.191-b12, mixed mode)
```

### Oracle JDK 7

```shell
jdk_switcher home oraclejdk7
# /usr/lib/jvm/java-7-oracle
jdk_switcher use oraclejdk7
echo $JAVA_HOME
# /usr/lib/jvm/java-7-oracle
echo $JRE_HOME
# /usr/lib/jvm/java-7-oracle/jre
java -version
# java version "1.7.0_80"
# Java(TM) SE Runtime Environment (build 1.7.0_80-b15)
# Java HotSpot(TM) 64-Bit Server VM (build 24.80-b11, mixed mode)
```

### Oracle JDK 8

```shell
jdk_switcher home oraclejdk8
# /usr/lib/jvm/java-8-oracle
jdk_switcher use oraclejdk8
echo $JAVA_HOME
# /usr/lib/jvm/java-8-oracle
echo $JRE_HOME
# /usr/lib/jvm/java-8-oracle/jre
java -version
# java version "1.8.0_201"
# Java(TM) SE Runtime Environment (build 1.8.0_201-b09)
# Java HotSpot(TM) 64-Bit Server VM (build 25.201-b09, mixed mode)
```

### Oracle JDK 9

```shell
jdk_switcher home oraclejdk9
# /usr/lib/jvm/java-9-oracle
jdk_switcher use oraclejdk9
echo $JAVA_HOME
# /usr/lib/jvm/java-9-oracle
echo $JRE_HOME
# /usr/lib/jvm/java-9-oracle/jre
java -version
# java version "9.0.4"
# Java(TM) SE Runtime Environment (build 9.0.4+11)
# Java HotSpot(TM) 64-Bit Server VM (build 9.0.4+11, mixed mode)
```

### Other Versions With SDKMAN

If you need to install a different JDK version, consider using [SDKMAN](https://sdkman.io) to install it. For example if you want to install OpenJDK 11, you can add the following to your _Setup Commands_:

```
source /dev/stdin <<< "$(curl -sSL https://raw.githubusercontent.com/codeship/scripts/master/packages/sdkman.sh)"

sdk install java 11.0.2-open

export PATH=$HOME/.sdkman/candidates/java/current/bin:$PATH

export JAVA_HOME=$HOME/.sdkman/candidates/java/current

# Add if you want to confirm the installed version
java -version
```

Note the available JDK versions in SDKMAN change as new JDK versions come out so the specific version you are installing may need to be updated occasionally. You can check the available versions by running `sdk list java`.

### Build Tools

The following tools are preinstalled in our virtual machine. You can add them to your setup or test commands to start your build:

* [Ant](https://ant.apache.org) (1.9.10)
* [Gradle](https://gradle.org) (4.6)
* [Leiningen](https://leiningen.org) (2.8.1)
* [Maven](https://maven.apache.org) (3.5.3)
* [sbt](https://www.scala-sbt.org) (0.13.16)

### JVM-based languages

[Scala](https://www.scala-lang.org), [Clojure](https://clojure.org), [Kotlin](https://kotlinlang.org), [Groovy](http://groovy-lang.org) and other JVM based languages should also run on Codeship. [Let us know](https://helpdesk.codeship.com) if you find something that doesn't work as expected.

## Dependencies

Installing dependencies through Maven is fully supported.

## Dependency Cache

Codeship automatically caches the `$HOME/.ivy2` and `$HOME/.m2/repository` directories between builds to optimize build performance. You can [read this article to learn more]({{ site.baseurl }}{% link _basic/builds-and-configuration/dependency-cache.md %}) about the dependency cache and how to clear it.

## Frameworks And Testing

All build tools and test frameworks, such as [JUnit](https://junit.org), will work.

## Parallel Testing

If you are running [parallel test pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), you will want separate your tests into groups and call a group specifically in each pipeline. For instance:

**Pipeline 1:**
```shell
mvn test -Dtest=class_1
```

**Pipeline 2:**
```shell
mvn test -Dtest=class_2
```

### Parallelization Modules

In addition to parallelizing your tests explicitly [via parallel pipelines]({{ site.baseurl }}{% link _basic/builds-and-configuration/parallel-tests.md %}), some customers have found using the parallel features in JUnit and other testing frameworks to be a good way to speed up your tests.

Note that aggressive parallelization can cause resource and build failure issues, as well.

## Notes And Known Issues

Due to Java version issues, you may find it helpful to test your commands with different versions via an [SSH debug session]({{ site.baseurl }}{% link _basic/builds-and-configuration/ssh-access.md %}) if tests are running differently on Codeship compared to your local machine.

### JCE

The Java Cryptography Extension (JCE) ships from Oracle [by default](https://www.java.com/en/jre-jdk-cryptoroadmap.html) on Java 8 and Java 9. You can also check if JCE is in limited or unlimited mode by checking the allowed key length. Limited mode will return `128` and unlimited mode will return `2147483647`.

```
jdk_switcher use oraclejdk9
jrunscript -e 'print (javax.crypto.Cipher.getMaxAllowedKeyLength("AES"));'
```
