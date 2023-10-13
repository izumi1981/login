import * as sqlite3 from 'sqlite3';
import express from "express";
import type { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const db = new sqlite3.Database('data/test.db');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

type Account = {
    id: number;
    name: string;
    mail: string;
    password: string;  
};

// クエリを実行
const initialize = async () => {
    db.run('CREATE TABLE IF NOT EXISTS accounts (id INT, name TEXT, mail TEXT, password TEXT)');

    // データベースを閉じる
    // db.close();
};

initialize();



const insert = async (req: Request, res: Response) => {
    db.run('INSERT INTO accounts (id, name, mail, password) VALUES (?, ?, ?, ?)', [1, req.body.name, req.body.mail, req.body.password]);
 
    res.sendFile(__dirname + "/signuped.html");
    // データベースを閉じる
    // db.close();
};
  
const select = async (req: Request, res: Response) => {
 
 //   // クエリの結果を取得
    db.all('SELECT * FROM accounts', (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            let flag: boolean = false;
            for (const row of rows) {
                const account = row as Account
                if (account.mail == req.body.mail && account.password == req.body.password) {
                    flag = true;
                    res.sendFile(__dirname + "/index.html");
//                    res.json({result: "success"});
                    break;
                }
            }
            if (flag == false) {
                res.sendFile(__dirname + "/loginerror.html");
            }
        }
    });
  
    // データベースを閉じる
    // db.close();
};





app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/signup", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", (req: Request, res: Response) => {
    insert(req, res);
});

app.post("/login", (req: Request, res: Response) => {
    select(req, res);
});

app.listen(port, () => {
    console.log("http://localhost:" + port);
});