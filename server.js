const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

/******************************************************
 *
 * Chapter 7 !
 *
 ******************************************************/

//  - START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
