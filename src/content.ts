const inputs = document.getElementsByTagName('input');

for (let i = 0; i < inputs.length; i++) {
  if (inputs[i].type === 'text') {
    inputs[i].value = 'dog'
  }
}
