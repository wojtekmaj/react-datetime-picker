const fs = require('fs');

fs.copyFile('./src/DateTimePicker.less', 'dist/DateTimePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DateTimePicker.less copied successfully.');
});

fs.copyFile('./src/DateTimePicker.css', 'dist/DateTimePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DateTimePicker.css copied successfully.');
});
