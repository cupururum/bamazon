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

readProductsAndAskCustomer()


function readProductsAndAskCustomer() {
  console.log("")
  console.log(">>>>>>>>>>>>")
  console.log("")
  console.log("Available item in the store");
  console.log("")
  console.log(">>>>>>>>>>>>")
  console.log("")

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
      createTable(res)
      askCustomer()
  });
}

function askCustomer() {

  inquirer.prompt([
    {
      name: "product_id",
      message: "Name the product ID you want to purchase: "
    },
    {
      name: "units",
      message: "How many units you want to purchase?"
    }
  ]).then(function(answers){
    var productIdUserWant = answers.product_id
    var numberOfUnitsUserWant = answers.units

    connection.query("SELECT * FROM products WHERE id=?", [productIdUserWant], function(err, res) {
      if (err) throw err;
      
      if (res[0] === undefined) {
        console.log("")
        console.log(">>>>>>>>>>>>")
        console.log("")
        console.log("We didn't find the item with the requested ID. Try again, please.")
        console.log("")
        console.log(">>>>>>>>>>>>")
        console.log("")
        askCustomer()
      } else {
        var totalCurrentStock = res[0].stock_quantity
        var productName = res[0].product_name
        var productPrice = res[0].price
  
        if (numberOfUnitsUserWant > totalCurrentStock) {
          if (parseInt(totalCurrentStock) === 0 ) {
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            console.log("Sorry, the item " + productName+ " with ID " + productIdUserWant + " is out of stock!")
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            createTable(res)
            tryAgainPurchase()
          } else {
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            console.log("Unfortunatly, we don't have enough items in stock for your purchase. We have " + totalCurrentStock +
                        " of " + productName+ " with ID " + productIdUserWant + " left in stock.")
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            createTable(res)
            tryAgainPurchase()
          }
  
        } else {
          // update Database
           var totalCost = productPrice * numberOfUnitsUserWant
           console.log("")
           console.log(">>>>>>>>>>>>")
           console.log("")
           console.log("Total cost of your purchase: " + Math.round(totalCost) + " USD.")
           console.log("")
           console.log(">>>>>>>>>>>>")
           console.log("")
  
           var unitsLeftInStockAfterPurchase = totalCurrentStock - numberOfUnitsUserWant
  
           updateProduct(unitsLeftInStockAfterPurchase, productIdUserWant)
  
           showAndAskAfterUpdate(productIdUserWant)
  
          // show user the total cost of purchase
        }
      }  
  }) // end of connection
 }) //end of prompt
}

function updateProduct(unitsLeftInStockAfterPurchase, productIdUserWant) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: unitsLeftInStockAfterPurchase
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

function showAndAskAfterUpdate (productIdUserWant) {
    connection.query("SELECT * FROM products WHERE id=?", [productIdUserWant], function(err, res) {
      if (err) throw err;
      createTable(res)
      tryAgainPurchase()
    });
}


function tryAgainPurchase() {
  inquirer.prompt([
    {
      type: "list",
      name: "lessItems",
      message: "Do you want to try again or do you want to quit?",
      choices: ["Try again", "Quit"]
    }
  ]).then(function(aswers) {
    if (aswers.lessItems === "Try again") {
      readProductsAndAskCustomer()
    } else {
      connection.end();
      return //quit application
    }
  })
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
