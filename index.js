const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();

dotenv.config({ path: path.join(__dirname, ".env") });

require("./src/startup/routes")(app);


app.get('/', (req, res)=>{
   res.send("OK");
})


const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`Secure Server listning on port ${port}`);
});
