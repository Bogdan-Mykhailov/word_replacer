import {dictionary} from "./dictionary";

const selectedElements = [
  ...document.querySelectorAll<HTMLInputElement>('input[type="text"]'),
  ...document.querySelectorAll<HTMLElement>('[contenteditable="true"]'),
];

function createPopup(): HTMLElement {
  const popup = document.createElement('div');
  popup.id = 'wordReplacerPopup';
  popup.classList.add('root');

  const shadowRoot = popup.attachShadow({mode: 'open'});
  return popup;
}

function closePopup() {
  const popupElement = document.getElementById('wordReplacerPopup');
  if (popupElement) {
    popupElement.remove();
    selectedOptionIndex = -1;
  }
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleOutsideClick);
}

function positionPopup(popup: HTMLElement, targetElement: HTMLElement) {
  const rect = targetElement.getBoundingClientRect();
  const popupTop = rect.top;
  const popupLeft = rect.right + 5;

  popup.style.position = 'fixed';
  popup.style.top = popupTop + 'px';
  popup.style.left = popupLeft + 'px';
}

function updatePopupOptions(popup: HTMLElement, options: Element[], selectedIndex: number) {
  options.forEach((option, index) => {
    const element = option as HTMLElement;
    element.style.backgroundColor = index === selectedIndex ? 'rgba(255, 210, 128, 0.7)' : 'transparent';
  });
}

let selectedOptionIndex = -1;

function handleKeyDown(event: KeyboardEvent) {
  const popupElement = document.getElementById('wordReplacerPopup');
  if (popupElement) {
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
  if (popupElement && !popupElement.contains(event.target as Node)) {
    closePopup();
  }
}

selectedElements.forEach(element => element.addEventListener('input', () => {
  if (element instanceof HTMLInputElement) {
    const inputValue = element.value;
    const words = inputValue.split(' ');

      element.onkeyup = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          words.forEach(word => {
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
                  element.value = element.value.replace(word, replacement);
                  closePopup();
                });
              })

              positionPopup(popup, element);

              document.body.appendChild(popup);
              document.addEventListener('keydown', handleKeyDown);
              document.addEventListener('click', handleOutsideClick);
            }
          })
      }
    }
  } else if (element instanceof HTMLElement) {
    const inputValue = element.textContent;
    const words = inputValue && inputValue.split(' ');

    if (words && dictionary.hasOwnProperty(words[words.length - 1])) {
      element.onkeyup = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          words.forEach(word => {
            if (dictionary.hasOwnProperty(word) && !document.getElementById('wordReplacerPopup')) {
              const popup = createPopup()
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
                  // @ts-ignore
                  element.textContent = element.textContent.replace(word, replacement);
                  closePopup();
                });
              })

              positionPopup(popup, element);

              document.body.appendChild(popup);
              document.addEventListener('keydown', handleKeyDown);
              document.addEventListener('click', handleOutsideClick);
            }
          })
        }
      }

      return element.textContent;
    }
  }
}))

