# Design Standards 

## Setup ESLINT (presume npm is already installed)
1. Run  ` npm install  ` 
2. Go to VSCode commands and search up "Open User Settings (JSON)" and find the settings.json 
3. Install the ESLint VSCode extention. 
4. Add the following to the settings.json 
` "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.validate": ["javascript, html", "css"] `

5. Restart the VsCode client and test to see if automatic stylings are applied on save. 