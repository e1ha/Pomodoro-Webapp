# Contribute to our application!
We would love for developers to contribute to our project. To make changes to this codebase, please follow the following steps.

1. Get the Pomodoro Application running on your computer.
   - Follow the instructions on the README to clone this repository and run our application.
   - Ensure that you have installed all the necessary Visual Studio Code extentions.
2. Create a ticket on our GitHub Project in the "Backlog" section.
   - Please name your ticket thoroughly for us to review your work!
3. Create an issue for your change.
   - Follow the "Feature" issue template. Write a thorough description and attach images as desired.
   - Assign the yourself to the issue!
   - Assign the appropriate labels to the issue.
4. Move your ticket on our GitHub Project to the "In Progress" section.
   - Link the issue you created in step 3 to the ticket.
5. Create a branch from master. 
   - Please name the branch appropriately. For example, if you are creating a new feature, name the branch "feature/X" where X is the name of the feature you wish to incorporate. Separate the words within the feature name with dashes.
6. Checkout to your newly created branch.
7. Make your change. This is your chance to be creative!
8. Thoroughly document your code with comments for us to follow your work.
9. Write any unit tests following Jest as required.
   - Add the test file to ./__tests__ with the name "filename.test.js".
10. After making your changes, utilize ESLint and Prettier to follow the code quality enforced in our codebase. 
   - Run the following commands and ensure that you have no errors:
   - ```npm run format```
   - ```npm run lint```
11. Commit & push to your branch on GitHub.
12. Go to "Actions" and ensure you have a green checkmark.
   - This checkmark indicates that all of the steps in our build pipeline have passed!
   - If you have a red X instead of a green checkmark, click on your latest commit in "Actions". Review the steps of the build pipeline to find your error. Update your code as necessary and push again until you have a green checkmark.
13. Create a pull request. 
   - Change the request to merge your branch into master.
   - Follow the format to write a thorough descriptions of the changes you made.
   - Link the issue you created in step 3 to your Pull Request.
14. You are all set! Please wait for approving reviews on your Pull Request. Thank you for your contribution!
