# JavaScript Source Code Organization 

* Status: Accepted
* Deciders: Uposhanto Bhattacharya, Trevor Tsai, Ryan Bui, Qingyuan Zhang, Farheen Ansari, Yueqi Wang, Elaine Ha, Anoushka Dave, Miguel Serrano
* Date: 01/30/2021

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

## Decision Outcome

Chose **Option 1**. We want to ensure that we always follow best coding practices. We also want to keep our repository tidy while maximizing unit testing. 
Overall, the pros outweigh the cons for option 1.

<!-- markdownlint-disable-file MD013 -->
