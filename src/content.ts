interface Dictionary {
  [key: string]: string[];
}

const dictionary: Dictionary = {
  Cat: ['Dog', 'Rat', 'bat'],
  Helo: ['hello', 'Help', 'Hell'],
  heldp: ['help', 'held', 'hello'],
};

// Вибираємо початкові елементи
const selectedElements = [
  ...document.querySelectorAll<HTMLInputElement>('input[type="text"]'),
  ...document.querySelectorAll('div[contenteditable="true"]'),
];

function createPopup(): HTMLElement {
  const popup = document.createElement('div');
  popup.id = 'wordReplacerPopup';
  popup.classList.add('root');

  // Додаємо попап до shadow DOM
  const shadowRoot = popup.attachShadow({ mode: 'open' });

  return popup;
}

function positionPopup(popup: HTMLElement, targetElement: HTMLElement) {
  const rect = targetElement.getBoundingClientRect();
  const popupTop = rect.top;
  const popupLeft = rect.right + 5; // позиціоную попап на 5px праворуч від елемента

  popup.style.position = 'fixed';
  popup.style.top = popupTop + 'px';
  popup.style.left = popupLeft + 'px';
}

// Явне визначення типів для функції handleInputEvent
let previousInputValue = ''; // Зберігаємо попереднє значення поля вводу

function handleInputEvent(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target) {
    const inputElement = target;
    const inputValue = inputElement.value.trim();
    const words = inputValue.split(' ');

    // Очищаємо попап, якщо значення поля для вводу змінилося та не містить ключового слова
    if (inputValue !== previousInputValue) {
      const popupElement = document.getElementById('wordReplacerPopup');
      if (popupElement !== null) {
        popupElement.remove();
      }
    }

    // Зберігаємо поточне значення для майбутніх порівнянь
    previousInputValue = inputValue;

    // Ваша подальша логіка обробки введення
    words.forEach((word) => {
      if (dictionary.hasOwnProperty(word) && !document.getElementById('wordReplacerPopup')) {
        const popup = createPopup();

        const replacements = dictionary[word] || [];
        replacements.forEach((replacement) => {
          const option = document.createElement('div');
          option.textContent = replacement;
          option.style.cursor = 'pointer';
          option.style.marginBottom = '5px';

          // Перевіряємо, чи shadowRoot не є null
          if (popup.shadowRoot !== null) {
            popup.shadowRoot.appendChild(option); // Додаємо опцію до тіньового DOM
          }

          option.addEventListener('click', () => {
            // Замінюємо слово та прибираємо попап
            inputElement.value = inputElement.value.replace(word, replacement);
            const popupElement = document.getElementById('wordReplacerPopup');
            if (popupElement !== null) {
              popupElement.remove();
            }
          });
        });

        positionPopup(popup, inputElement);

        // Додаємо попап до документу
        document.body.appendChild(popup);
      }
    });
  }
}

function startListening() {
  selectedElements.forEach((element) => {
    element.addEventListener('input', handleInputEvent);
  });
}

// Слідкуємо за змінами в DOM і викликаємо код для нових елементів
const observer = new MutationObserver(() => {
  startListening();
});

// Встановлюємо спостереження за body та його дочірніми елементами
observer.observe(document.body, { childList: true, subtree: true });

// Зупиняємо слідкування при видаленні розширення
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'stopObserving') {
    observer.disconnect();
  }
});

// Починаємо слухати події для початкових елементів
startListening();
