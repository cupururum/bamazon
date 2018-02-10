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

askManager()

function askManager() {
  inquirer.prompt([
    {
      type: "list",
      name: "menu_options",
      message: "Options: ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    }
  ]).then(function(answer) {
    var managerChoice = answer.menu_options

    if (managerChoice === "View Products for Sale") {
      //show select all
      showAllForSale()
    } else if (managerChoice === "View Low Inventory") {
      // show items with less than 5 items
      showLowInventory()
    } else if (managerChoice === "Add to Inventory") {
      // add inventory manager wants
      inquirer.prompt([
        {
          name: "item_id",
          message: "Name item ID you want to update: "
        },
        {
          name: "quantity",
          message: "Enter how many items you want to add to the inventory: "
        }
      ]).then(function(answers) {
        var productId = answers.item_id
        var quantity = answers.quantity

        connection.query("SELECT * FROM products WHERE id=?", [productId], function(err, res) {
          if (err) throw err
          var updateQuantity = res[0].stock_quantity + quantity
          addToInventory(updateQuantity, productId)
        })
      })
    } else if (managerChoice === "Add New Product") {
      inquirer.prompt([
        {
          type: "input",
          name: "product_name",
          message: "Enter product name: "
        },
        {
          type: "input",
          name: "department_name",
          message: "Enter the department name: "
        },
        {
          type: "input",
          name: "price",
          message: "Enter price for one item: "
        },
        {
          type: "input",
          name: "stock_quantity",
          message: "Enter stock quantity: "
        }
      ]).then(function(answers) {
         addNewProduct(answers)
         showAllForSale()
      })
    } else {
      connection.end()
      return
    }
  })
}

function showAllForSale() {
  connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
      createTable(res)
      askManager()
  });
}

function showLowInventory() {
  connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
      createTable(res)
      askManager()
  });
}

function addToInventory(unitsToUpdate, productIdUserWant) {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: unitsToUpdate
        },
        {
          id: productIdUserWant
        }
      ],
      function(err, res) {
        if (err) throw err;
      }
    );
}

function addNewProduct(object) {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    object,
    function(err, res) {
      if (err) throw err
      //console.log(res.affectedRows + " product inserted!\n");
    }
  );
  //askManager()
}

function createTable(res) {
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

  var responseTable = table(header,res,{
    borderStyle : 1,
    paddingBottom : 0,
    headerAlign : "center",
    align : "center",
    color : "white",
    defaultValue: "Out of Stock"
  });

  var respTableRender = responseTable.render();
  console.log(respTableRender);
  return true
}
