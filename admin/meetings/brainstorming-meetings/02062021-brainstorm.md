## Workflow
Tasks Page (landing page)
- Put in tasks (visuyal haptic feedback to redirect to instructions page)

Instructions Page
- View instructiosn
- Continue redirects to tasks page
- Now you can actually press start without any redirect and it takes you to the timer page(s)

Universal Timer Page
- [Break, work, long break]

```
Language Agnostic Pseudocode

00:00 (timer runs out) → finishedTask() → deleteTaskFromQueue() → decrementPomos() {
	pomos--;
}
```