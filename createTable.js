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

module.exports = createTable
