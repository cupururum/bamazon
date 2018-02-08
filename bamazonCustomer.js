const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("tty-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

var header = [
  {
    value : "id",
    headerColor : "cyan",
    color: "white",
    align : "center",
    width : 20
  },
  {
    value : "product_name",
    headerColor : "cyan",
    color: "white",
    align : "left",
    paddingLeft : 5,
    width : 130
  },
  {
    value : "department_name",
    headerColor : "cyan",
    color: "white",
    align : "center",
    width : 110
  },
  {
    value : "price",
    headerColor : "cyan",
    color: "white",
    align : "center",
    width : 50
  },
  {
    value : "stock_quantity",
    headerColor : "cyan",
    color: "white",
    align : "center",
    width : 80
  }
]

readProducts()

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    var responseTable = table(header,res,{
      borderStyle : 1,
      paddingBottom : 0,
      headerAlign : "center",
      align : "center",
      color : "white"
    });

    var respTableRender = responseTable.render();
    console.log(respTableRender);

    connection.end();
  });
}
