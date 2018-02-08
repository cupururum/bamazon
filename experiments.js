const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("tty-table");
const Customer = require("./BamazonCustomerConstructor")

var NewCustomer = new Customer()

//onsole.log(NewCustomer)

//NewCustomer.readProductsAndAskCustomer()


console.log(NewCustomer instanceof Customer)
