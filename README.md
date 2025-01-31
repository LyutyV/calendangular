# Calendangular

This project is a calendar application built with Angular.
It includes features such as adding, deleting, and moving events, and utilizes Angular Material and Angular CDK for UI components and drag-and-drop functionality.

## Features

-   Form for adding events to the calendar
-   Ability to delete events
-   Ability to move events
-   Use of `Date()` for handling dates and times
-   Drag & Drop functionality using Angular CDK
-   Rendering dates in the calendar using `*ngFor` with `trackBy`
-   Rendering the list of events using `*ngFor` with `trackBy`
-   Use of Angular Material for UI components
-   No additional libraries used
-   Use of NgRX for state management
-   Emulation of backend using `sessionStorage` with NgRX side effects
-   Use of Angular signals with NgRX
-   Dynamic creation and injection of event detail components for editing
-   Event duration rounded to 5 minutes, with a minimum duration of 5 minutes
-   Blocking of dragging events to occupied slots
-   Dynamic display of start and end time changes during event dragging
-   Simple animation for height changes of event tags when start or end time is changed
-   Separate components for events and event details
-   Use of `OnPush` change detection strategy for all components
-   Validation of user input

## Best Practices

-   Proper use of Dependency Injection
-   Lazy Loading for modules/routes
-   Routing using `RouterModule` and `<router-outlet>`
-   Reactive Forms for value changes, validation, and event handling
-   Use of standalone components and/or shared components

## Steps to Run

1. Clone the repository:

```bash
git clone https://github.com/LyutyV/calendangular.git
cd calendangular/frontend
```

2. Install dependencies:

```bash
npm install
ng serve
```

3. Open your browser and navigate to `http://localhost:4200`
