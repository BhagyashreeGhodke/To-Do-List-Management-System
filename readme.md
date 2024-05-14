## Overview:

Develop a backend application using Node.js and Express.js to manage a todo list. Users should be able to perform CRUD operations on todo items, upload todo items from a CSV file, download the todo list in CSV format, and set a status flag for each todo item.

- [Video link](https://drive.google.com/drive/folders/1CE58SO9qVa9JeTiMYOh6cXm9WMwhSFCX?usp=drive_link)

  ## Instructions to run locally:

  1. git clone https://github.com/BhagyashreeGhodke/To-Do-List-Management-System.git
  2. npm init -y
  3. npm i cookie-parser cors csv-parser csv-writer dotenv express fs mongoose multer
  4. create .env file in root directory
  5. write in .env file:
     MONGODB_URI=mongodb+srv://bhagyashree:<password>@project1.jhl0lss.mongodb.net (mongodb connection string)
     CORS_ORIGIN=*
  6. edit package.json file: "type" : "module", "dev": "node src/index.js"
  7. npm run dev
  

