const fs = require('fs');

fs.copyFile('src/DateTimePicker.css', 'dist/DateTimePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DateTimePicker.css copied successfully.');
});
