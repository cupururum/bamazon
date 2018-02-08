const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("tty-table");

var Customer = function() {
  this.connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  this.updateProduct = function(unitsLeftInStockAfterPurchase, productIdUserWant) {
    var query = this.connection.query(
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

  }// end of this.updateProduct

  this.showAndAskAfterUpdate = function(productIdUserWant) {
    this.connection.query("SELECT * FROM products WHERE id=?", [productIdUserWant], function(err, res) {
      if (err) throw err;
      this.createTable(res)
      this.tryAgainPurchase()
    });
  }// end of this.showAndAskAfterUpdate
  this.tryAgainPurchase = function() {
    inquirer.prompt([
      {
        type: "list",
        name: "lessItems",
        message: "Do you want to try again or do you want to quit?",
        choices: ["Try again", "Quit"]
      }
    ]).then(function(aswers) {
      if (aswers.lessItems === "Try again") {
        this.readProductsAndAskCustomer()
      } else {
        this.connection.end();
        return //quit application
      }
    })
  } // end of this.tryAgainPurchase
  this.createTable = function(res) {
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
  } //end of this.createTable

  this.askCustomer = function() {
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

      this.connection.query("SELECT * FROM products WHERE id=?", [productIdUserWant], function(err, res) {
        if (err) throw err;

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
            this.createTable(res)
            this.tryAgainPurchase()
          } else {
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            console.log("Unfortunatly, we don't have enough items in stock for your purchase. We have " + totalCurrentStock +
                        " of " + productName+ " with ID " + productIdUserWant + " left in stock.")
            console.log("")
            console.log(">>>>>>>>>>>>")
            console.log("")
            this.createTable(res)
            this.tryAgainPurchase()
          }

        } else {
          // update Database
           var totalCost = productPrice * numberOfUnitsUserWant
           console.log("")
           console.log(">>>>>>>>>>>>")
           console.log("")
           console.log("Total cost of your purchase: " + totalCost + " USD.")
           console.log("")
           console.log(">>>>>>>>>>>>")
           console.log("")

           var unitsLeftInStockAfterPurchase = totalCurrentStock - numberOfUnitsUserWant

           this.updateProduct(unitsLeftInStockAfterPurchase, productIdUserWant)

           this.showAndAskAfterUpdate(productIdUserWant)

          // show user the total cost of purchase
        }
    }) // end of connection
   }) //end of prompt
  }// end of this.askCustomer

    this.readProductsAndAskCustomer = function() {
      console.log("")
      console.log(">>>>>>>>>>>>")
      console.log("")
      console.log("Available item in the store");
      console.log("")
      console.log(">>>>>>>>>>>>")
      console.log("")

      this.connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
          this.createTable(res)
          this.askCustomer()
      });
    } // end of readProductsAndAskCustomer
}// end of constructor

module.exports = Customer
