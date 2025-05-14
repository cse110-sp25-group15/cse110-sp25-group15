# ADR 3: Vite Javascript Bundling 

**Date:** 13 May, 2025  
**Status:** Proposed  
**Deciders:** 10X Brogrammers Team (Team 15) - Haoyan Wan


## Context
- We utilize a webcomponent architecture to create locallity of behavior and separation of concerns. This results in less conlifcts in terms of styles clashing and allows more developers to work in parallel. However, that also brings a challenge of bundling our html/css inside of the java script that creates the custom component. We cannot separate the html/css/js files unless we utilize fetch requests to get the styles and html across files. That presents the need for a javascript bundler. 

## Proposal
- Utilize Vite to bundle together the javascript for our files before serving the final static files to the webserver. 


## Rationale
- Vite still allows for hot reload, it will simply use a different method of serving local dev environment which allows developers to keep their fast iterations. 
- Vite is fast and solves our problem of having separate css/html files that needs joining/bundling into our js. 
- Vite is easy to integrate and it doesnt add much size to the final package that we serve to our users, resulting in no performance penalties or even improvements. 


## Potential Downsides
- Addition of npm packages can be hard to keep track of
- Developers would need to get onboarded on how to use vite which could waste time
- Vite requires some setup when it comes to deployment pipelines, adding complexity

## Alternatives Considered
- Have considered the usage of webpack
    - Webpack doesnt offer any additional functionality that we would need
    - Webpack adds more complexity than the simple installation and use of vite
    - Webpack is just larger in general 
---