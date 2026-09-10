const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Xử lý khi không có tham số ngày tháng
app.get(['/api', '/api/'], (req, res) => {
  const date = new Date();
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Xử lý khi có tham số ngày tháng
app.get('/api/:date', (req, res) => {
  const dateInput = req.params.date;
  let date;

  if (/^\d+$/.test(dateInput)) {
    date = new Date(parseInt(dateInput));
  } else {
    date = new Date(dateInput);
  }

  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});