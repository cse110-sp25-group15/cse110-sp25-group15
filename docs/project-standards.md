# Design Standards 

The following are instructions to get setup with coding styles and typical rules to follow when designing/solving tasks. 

## Styling guide/setup ESLINT (presume npm is already installed)
1. Run  ` npm install  ` 
2. Install the ESLint VSCode extention. 
3. Go to VSCode commands and search up "Open User Settings (JSON)" and find the settings.json 
4. Add the following to the settings.json 
` "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.validate": ["javascript, html", "css"] `

5. Restart the VsCode client and test to see if automatic stylings are applied on save. 


## Locality of Behavior 

- Try to keep closely related pieces of code/components closer together
    - CSS and html for the same component should be close together when possible. (Web Component Architecture)
    - Local component state should be handled near or in the same folder. 
    - Ex. Onclicks for buttons should be added near where the html for the button is
- CSS for components should be kept in shadow dom and separate from global namespace 
- Exception: NO inline css, no mixture of css and html


## Package and AI usage

- All LLM usage requires elaboration/explaination for design choices made by it. 
- External npm packages and frameworks are NOT allowed unless proven/justified for necessity
- LLM usage should adhere to locality of behavior and all other styling guidlines. 


## TODO TOBE ADDED

