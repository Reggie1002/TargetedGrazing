const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { result: null, result3: null });
});

app.post('/calculate', (req, res) => {
    const {
        txt6, num7, num1, num2, num3,
        num4, num5, num11, num12, num13,
        num14, num15
    } = req.body;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    const output = req.body.output;
    const numbers = [parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(num4), parseFloat(num5)];
    let sum = 0;
    let counter = 0;
    for (const num of numbers) {
        if (!isNaN(num) && num !== 0) {
            sum += num;
            counter++;
        }
    }
    let division = counter !== 0 ? sum / counter : 'Division by zero error';

    const result = `
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,G,1,${num1}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,G,2,${num2}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,G,3,${num3}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,G,4,${num4}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,G,5,${num5}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,AvgG,1,${division}`;

    const numbers3 = [parseFloat(num11), parseFloat(num12), parseFloat(num13), parseFloat(num14), parseFloat(num15)];
    let sum3 = 0;
    let counter3 = 0;
    for (const num of numbers3) {
        if (!isNaN(num)) {
            sum3 += num;
            counter3++;
        }
    }
    let division3 = counter3 !== 0 ? sum3 / counter3 : 'Division by zero error';

    const result3 = `
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,S,1,${num11}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,S,2,${num12}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,S,3,${num13}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,S,4,${num14}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,S,5,${num15}\r\n
${txt6},${num7},${output},${formattedDate},${formattedTime},Pre,AvgS,1,${division3}`;

    res.render('index', { result, result3 });
});

app.get('/download', (req, res) => {
    const result = req.query.result || '';
    const result3 = req.query.result3 || '';

    const headerText = 'Site,Plot,Lat,Lon,Date,Time,Period,Measure,Subsample,Value';
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const timestamp = `${formattedDate}_${formattedTime.replace(/:/g, '-')}`;

    const fileContent = `${headerText}\n${result}\n${result3}`;
    const filePath = path.join(__dirname, 'public', `Monitoring_Data_${timestamp}.txt`);

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).send('Error generating file');
        }
        res.download(filePath, `Monitoring_Data_${timestamp}.txt`, (err) => {
            if (err) {
                return res.status(500).send('Error downloading file');
            }
            fs.unlink(filePath, () => {});
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});