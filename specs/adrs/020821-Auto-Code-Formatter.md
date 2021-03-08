# Auto Code Formatter

* Status: Accepted
* Deciders: Uposhanto Bhattacharya, Trevor Tsai, Ryan Bui, Qingyuan Zhang, Farheen Ansari, Yueqi Wang, Elaine Ha, Anoushka Dave, Miguel Serrano
* Date: 02/08/2021

## Context and Problem Statement

How should we enforce code style and quality amongst our developer? How can we make our codebase look like it was written by one developer?

## Decision Drivers <!-- optional -->

* We want to ensure that our codebase follows good styling and quality practices.

## Considered Options

* We researched the following three code formatters:
* Option 1: Prettier 
  This is a VSCode extension; since all developers are using VSCode, we should be able to easily install this.
  Prettier is fairly simple to set up as a part of our CI/CD pipeline as all we have to do is write a formatting script and have developers get the extension.
  Additionally, Prettier is very popular so we should be able to easily troubleshoot it.
* Option 2: Code Formatter
  This is a VSCode extension; since all developers are using VSCode, we should be able to easily install this.
  Code formatter is not as popular as Prettier, we aren't sure if we will be able to find as many resources for it.
  Code formatter only works for certain types of class files, so this may not work with our HTML, CSS, and JavaScript files.
* Option 3: Code Beautify
  This is an online software which we would have to paste our code into to format. This is a lot of extra work for the developers. Many other similar 
  code formatters which we found are online softwares that increase the work time.

## Decision Outcome

Chose **Option 1**. Since most of us are working with a CI/CD pipeline and code formatters for the first time, we want to pick something that is easy to set up and
troubleshoot. Prettier is very popular and Prof. Powell has even mentioned it during his lectures. Thus, we think Prettier is the best choice for us to enforce code
style and quality to improve developer practices.

<!-- markdownlint-disable-file MD013 -->
