# Timer Pages Structure

* Status: Superceded [here](020621-Timer-Pages-Structure.md) on 02/06/2021
* Reason for change: We had more reasons (reducing complexity and user experience) to switch to Option 2. The reasoning is in the document linked above.
* Deciders: Uposhanto Bhattacharya, Trevor Tsai, Ryan Bui, Qingyuan Zhang, Farheen Ansari, Yueqi Wang, Elaine Ha, Anoushka Dave, Miguel Serrano
* Date: 01/31/2021

## Context and Problem Statement

How should we organize the Timer Pages in our Pomodoro App? Should we separate them or have one dynamic page?

## Decision Drivers <!-- optional -->

* We want to ensure that we have the most optimal design for the best user experience.

## Considered Options

* Option 1: Create separate timer pages for each type of timer (work, short break, long break).
  This allows different team members to work on different files without creating too many merge conflicts in the GitHub repository.
  This requires less JavaScript code to dynamically select the styling required for each type of page. We can simply style each page differently.
  It is easier to test our code as we can create unit tests for the separate files more easily.
* Option 2: Create a single dynamic timer page which changes between the type of timer.
  The overall functionality of each type of timer page is the same so we can reduce the amount of code needed for the three different pages.
  The full group stated that reducing the number of pages will reduce the complexity of our software.

## Decision Outcome

Chose **Option 1**. We want to at least start out able to change our files more easily. 
Since the developers are less experienced right now, we want to make sure we have our styling separate for different developers to work on.

<!-- markdownlint-disable-file MD013 -->
