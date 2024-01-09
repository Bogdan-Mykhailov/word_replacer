# Word Replacer

## Installation
```bash
npm install
```
# Important


To initiate the process, you'll first need to compile the project, creating the dist folder. Following this, you should upload the generated dist folder to the Google extension.

# Usage

Import the library into your project.
```
import { dictionary } from "./dictionary";
```


Add the following HTML elements to your document:
```
<input type="text" />
<div contenteditable="true"></div>
```

Initialize the Word Replacer by attaching the input event listener:

```
const selectedElements = [
  ...document.querySelectorAll<HTMLInputElement>('input[type="text"]'),
  ...document.querySelectorAll<HTMLElement>('[contenteditable="true"]'),
];

selectedElements.forEach(element => element.addEventListener('input', () => {
  onInput(element);
}));
```

# Features

- Replaces words in text inputs and contenteditable elements.
- Displays replacement suggestions in a popup based on a predefined dictionary.
- Supports keyboard navigation for selecting replacement options.

# Configuration

Dictionary

Edit the dictionary in the dictionary.ts file to define replacement options for specific words.

```
export const dictionary = {
  "example": ["replacement1", "replacement2"],
  "example2": ["replacement1", "replacement2"],
  "example2": ["replacement1", "replacement2"],
};
```

# License

This project is licensed under the MIT License.
