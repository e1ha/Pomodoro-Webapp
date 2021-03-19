# JavaScript Source Code Organization 

* Status: Accepted, Supercedes [this ADR](013021-JS-Source-Code-Organization.md) from 01/30/2021
* Deciders: Uposhanto Bhattacharya, Trevor Tsai, Ryan Bui, Qingyuan Zhang, Farheen Ansari, Yueqi Wang, Elaine Ha, Anoushka Dave, Miguel Serrano
* Date: 02/28/2021

## Context and Problem Statement

How should we organize the JavaScript code in our repository? Should we separate or consolidate the JavaScript code?

## Decision Drivers <!-- optional -->

* We want to modularize our code to follow best coding practices while making sure that our code is separated well.

## Considered Options

* Option 1: Modularize code into separate files to follow best coding practices and separation of concerns. 
  This allows different team members to work on different aspects of the code without creating too many merge conflicts in the GitHub repository.
  Inexperienced developers (many of us have not done web development in the past) can navigate the repository and files more easily.
  This keeps the code clean and maintainable.
  It is easier to test our code as we can create unit tests for the separate files more easily.
* Option 2: Group certain JavaScript code together (example: all buttons should go into a buttons.js file rather than creating different files for each button).
  This avoids over-modularizing our code to the point where the smallest set of code has a separate file.
  This allows for our code to run smoother as there is fewer files for the same type of functionality.
  Each page now has a unified script.
  Additionally, different interactive components will no longer conflict with each other.
  This still follows separation of concerns as we are grouping sections of like code into a file.

## Decision Outcome

Chose **Option 2**. We want to maintain a clean codebase that is easy to work with. In this way, we avoid over-modularizing our code while following best coding
practices and separation of concerns.

<!-- markdownlint-disable-file MD013 -->
