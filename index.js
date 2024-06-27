import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";


const app = express();
const port = 3000;
const saltRounds = 10;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "court",
    password: "password",
    port: 5432,
  });
  db.connect();



app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get("/login.ejs", (req, res) => {
  res.render("login.ejs");
});

app.get("/register.ejs", (req, res) => {
  res.render("register.ejs");
});

app.get("/casereg.ejs",(req,res)=>{
  res.render("casereg.ejs");
});

app.get("/lawyers.ejs", (req, res) => {
    res.render("lawyers.ejs");
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.render("index.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
  
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //Password Hashing
      bcrypt.hash(password,saltRounds, async (err, hash)=>{
        if(err){
          console.log("Error hashing password:",err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          console.log(result);
          res.render("casereg.ejs");
        
      }

      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/casereg", async (req,res)=>{
  const name = req.body.name;
  const id = req.body.clientid;
  const phone = req.body.number;
  const casedetails = req.body.cased;
  try {
    const ccresult = await db.query(
      "INSERT INTO details (name, client, phoneno, casedetails) VALUES ($1, $2, $3, $4)",
      [name, id, phone, casedetails]
    );
  }
  catch(err){
    console.log(err);
  }
  res.render("lawyers.ejs");
}
);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
