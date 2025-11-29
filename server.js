import express from 'express';
import ejs from 'ejs'

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));


const portIndex = process.argv.indexOf("--port");
const port = portIndex !== -1 ? process.argv[portIndex + 1] : 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get('/',(req,res) => {
  res.render('index', { activePage : "home"})
  
})