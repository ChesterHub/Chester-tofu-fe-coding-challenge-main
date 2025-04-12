# Tofu Frontend Coding challenge

Thank you for considering me for this role!
-- Chester

## What went well while building this project?

* The project was very unique, and I learned a lot about how Tofu’s product by working within the code. 
* I’m proud that I was able to learn the code and most of how data is being passed and persisted just by debugging and testing.
* I haven’t worked with iframes, especially within React, in a while and it was a good experience to figure things out in a short timeframe.
* Just the feeling that I was able to complete the take home, despite not knowing much about the codebase before!

## What didn't go well and you would like to improve?
* I could definitely organize some of the code to be easier for other engineers to digest. For example, types in their own files, maybe lifting functions higher up, can consider useReducer to handle state. 
* I added my own SetTimeout Debounce, only to later realize the app Lodash installed.
* Im not 100% but I think that removeListener is not needed on useEffect return function for the iframe, because when component unmounts the iframe should be gone.

## Was there anything you learnt while working through this project?
* Learned alot about the product of Tofu by going through this take home. Its a very cool feature!
* For event listeners, they snapshot the values within the function, we can useRef to fix that.
* In general, manipulating the iframe within a React Component.

## Is there anything that you would do to make the user experience of this application better?

* For User experience, definitely can add some skeleton loaders vs just a spinner.
* The feature where the components are added on the list in the Settings Component, maybe can have a button that will take you to the actual element on the landing page.

## Do you have any feedback about the API endpoints you were using or suggestions on how these could be better?

* Yes, some documentation on the API call payloads and what they are meant for would make understanding the feature a lot smoother. (Unless that’s part of the test is to learn with limited info).
* I believe the payload example for SelectedComponents on the Tofu Frontend challenge website is outdated. The preceding and succeeding element doesn’t match what I saw on the UI landing page.
* Why is TypeScript "strict": false ?!
