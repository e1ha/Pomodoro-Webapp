# Completing Tasks

* Status: Accepted
* Deciders: Uposhanto Bhattacharya, Trevor Tsai, Ryan Bui, Qingyuan Zhang, Farheen Ansari, Yueqi Wang, Elaine Ha, Anoushka Dave, Miguel Serrano
* Date: 02/27/2021

## Context and Problem Statement

This is not a problem that we thought of initially. After discussion with our TA, Sasya, we corrected a key design flaw in our user workflow for how the Pomodoro 
application should interact with users for task completion.

## Decision Drivers <!-- optional -->

* We want to ensure that users receive sufficient time to complete each of their tasks.

## Considered Options

* Option 1: No consideration of task completion.
  This is what we were following before our discussion with Sasya. After the allocated number of Pomos for a task was complete, we simply moved on to the next task
  with the next set of Pomos.
* Option 2: Functionality for task completion interaction with users.
  After a work session is complete, the user is prompted to see whether they need more time. If they do they estimate the time in minutes, otherwise they take the necessary break. 
  This is important, as users may require more time to complete their tasks than they estimated.
  Additionally, we allow users to end work sessions earlier if they complete their task before the allocated number of Pomos is complete. 
  This is also necessary, as users may complete their tasks quicker than they estimated.
  This can further be added to our analysis of the users' work sessions. We can analyze how accurate the user was in their estimation of the number of Pomos required
  as metrics (did they consistently overestimate or underestimate?).

## Decision Outcome

Chose **Option 2**. Users may not complete their tasks in the number of Pomos they allocated for the task. We cannot simply assume that they are done with their
task and must give them the option to add additional time. This also allows for metrics and analysis of the user's work session.

<!-- markdownlint-disable-file MD013 -->
