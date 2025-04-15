# Tofu Frontend Coding challenge

Thank you for considering me for this role!

I went through Git basic workflow, so you can see the project progress as it goes with my commits.
-- Chester

## What went well while building this project?
* The project was very unique, and I learned a lot about Tofu’s product by working within it.
* I was happy to learn the code and most of how data was being passed and persisted just by debugging and testing.
* I haven’t worked with iframes in a while in React and it was a good experience to figure things out in a short timeframe.

## What didn't go well and you would like to improve?
* Maybe I should have just used the content.components as the source of truth for all of the selected component data, instead of adding the state to handle the selections first. This would make the app alot simpler.
* I added my own SetTimeout Debounce, only to later realize the app Lodash installed.
* I could improve the organization of code to be easier to digest and maintain in the future. For example, types in their own files, lifting functions higher up, updating files from jsx to tsx.
* Possibilities to improve performance and state management, such as adding useCallbacks, React Memo, and considering useReducer. 

## Was there anything you learnt while working through this project?
* Learned alot about the product of Tofu by going through this take home. It was a very cool feature!
* For event listeners, they snapshot the  initial state values within the function, we can useRef to fix that.
* In general, manipulating the iframe within a React Component has alot of challenges.

## Is there anything that you would do to make the user experience of this application better?

* For improved user experience, definitely can add some skeleton loaders.
* For customers, when components are added on the list in the Settings Component, maybe there can be a button that will take you to the actual element on the landing page.

## Do you have any feedback about the API endpoints you were using or suggestions on how these could be better?
* Yes, some documentation on the API call payloads and what they are meant for would make understanding the feature a lot smoother. (Unless that’s part of the test is to learn with limited info).
* I believe the payload example for SelectedComponents on the Tofu Frontend challenge website is outdated. The preceding and succeeding element doesn’t match what I saw on the UI landing page.
* Why is TypeScript "strict": false ?!
