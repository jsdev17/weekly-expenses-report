'use strict';

/////////////////////////////
/////   Master Server   /////
/////////////////////////////

//////////////////////////////////////
///// Bring in dependencies, etc /////
//////////////////////////////////////

const path = require('path');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const logger = require('morgan');
const keys = require('./config');

// Colors for console messages
const { y, m, g, r, b } = require('./console');

const app = express();
const port = keys.port;
const dbKeys = keys.init().db;

////////////////////////////
///// DB Configuration /////
////////////////////////////

require('./db/mongoose')(dbKeys);

///////////////////////////////
///// Register Middleware /////
///////////////////////////////

app.use(logger('dev'));
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/plaid', express.static('public'));
app.use('/join', express.static('public'));
app.use('/login', express.static('public'));

////////////////////////////////////////////////
///// Routes registration and configuration ////
////////////////////////////////////////////////

const root = express.Router();
const user = express.Router();
const sms = express.Router();
const plaid = express.Router();

require('./routes/root')(root);
require('./routes/user')(user);
require('./routes/sms')(sms);
require('./routes/plaid')(plaid);

/////////////////////////
///// API Catalogue /////
/////////////////////////

// Root route
app.get('/', root); // other routes are inaccessible if we use app.use here...
// User route
app.use('/user', user);
// SMS route
app.use('/api/sms', sms);
// Plaid route
app.use('/api/plaid', plaid);

//////////////////////////
///// Spin up server /////
//////////////////////////

app.listen(port, () => {
  console.log(m(`Master server listening on port ${port}`));
});
