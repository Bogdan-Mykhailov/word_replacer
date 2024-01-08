import {dictionary} from "./dictionary";

let selectedOptionIndex = -1;

function closePopup() {
  const popupElement = document.getElementById('wordReplacerPopup');
  if (popupElement !== null) {
    popupElement.remove();
    selectedOptionIndex = -1;
  }

  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleOutsideClick);
}

const selectedElements = [
  ...document.querySelectorAll<HTMLInputElement>('input[type="text"]'),
  ...document.querySelectorAll('div[contenteditable="true"]'),
];

function createPopup(): HTMLElement {
  const popup = document.createElement('div');
  popup.id = 'wordReplacerPopup';
  popup.classList.add('root');

  const shadowRoot = popup.attachShadow({ mode: 'open' });

  return popup;
}

function positionPopup(popup: HTMLElement, targetElement: HTMLElement) {
  const rect = targetElement.getBoundingClientRect();
  const popupTop = rect.top;
  const popupLeft = rect.right + 5;

  popup.style.position = 'fixed';
  popup.style.top = popupTop + 'px';
  popup.style.left = popupLeft + 'px';
}

let previousInputValue = '';

function handleInputEvent(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target) {
    const inputElement = target;
    const inputValue = inputElement.value.trim();
    const words = inputValue.split(' ');

    if (inputValue !== previousInputValue) {
      closePopup();
    }

    previousInputValue = inputValue;

    words.forEach((word) => {
      if (dictionary.hasOwnProperty(word) && !document.getElementById('wordReplacerPopup')) {
        const popup = createPopup();

        const replacements = dictionary[word] || [];
        replacements.forEach((replacement) => {
          const option = document.createElement('div');
          option.textContent = replacement;
          option.style.cursor = 'pointer';
          option.style.marginBottom = '5px';
          option.style.padding = '0 15px';
          option.style.textAlign = 'center';
          option.style.borderRadius = '4px';

          if (popup.shadowRoot !== null) {
            popup.shadowRoot.appendChild(option);
          }

          option.addEventListener('click', () => {
            inputElement.value = inputElement.value.replace(word, replacement);
            closePopup();
          });
        });

        positionPopup(popup, inputElement);

        document.body.appendChild(popup);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleOutsideClick);
      }
    });
  }
}

function updatePopupOptions(popup: HTMLElement, options: Element[], selectedIndex: number) {
  options.forEach((option, index) => {
    const element = option as HTMLElement;
    element.style.backgroundColor = index === selectedIndex ? 'rgba(255, 210, 128, 0.7)' : 'transparent';
  });
}

function handleKeyDown(event: KeyboardEvent) {
  const popupElement = document.getElementById('wordReplacerPopup');
  if (popupElement !== null) {
    const options = Array.from(popupElement.shadowRoot?.children || []);
    const selectedIndex = options.findIndex((option) => {
      const element = option as HTMLElement;
      return element.style.backgroundColor === 'rgba(255, 210, 128, 0.7)';
    });

    if (event.key === 'ArrowDown') {
      selectedOptionIndex = Math.min(selectedOptionIndex + 1, options.length - 1);
      updatePopupOptions(popupElement, options, selectedOptionIndex);
    } else if (event.key === 'ArrowUp') {
      selectedOptionIndex = Math.max(selectedOptionIndex - 1, 0);
      updatePopupOptions(popupElement, options, selectedOptionIndex);
    } else if (event.key === 'Enter') {
      const selectedOption = options[selectedIndex] as HTMLElement;
      if (selectedOption) {
        selectedOption.click();
      }
    }
  }
}

function handleOutsideClick(event: MouseEvent) {
  const popupElement = document.getElementById('wordReplacerPopup');
  if (popupElement !== null && !popupElement.contains(event.target as Node)) {
    closePopup();
  }
}

function startListening() {
  selectedElements.forEach((element) => {
    element.addEventListener('input', handleInputEvent);
  });
}

const observer = new MutationObserver(() => {
  startListening();
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'stopObserving') {
    observer.disconnect();
  }
});

startListening();
