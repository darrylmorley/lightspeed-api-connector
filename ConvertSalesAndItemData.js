const fs = require("fs");

let sales = JSON.parse(fs.readFileSync("./temp/sales.json"));
let items = JSON.parse(fs.readFileSync("./temp/items.json"));

var merged = [].concat.apply([], items);

items = merged.map(x => {
  let { itemID, customSku } = x;
  return {
    itemID,
    customSku
  };
});

// console.log(items);

sales = sales.map(function(sale) {
  sale["SaleLines"]["SaleLine"] = sale["SaleLines"]["SaleLine"].map(function(
    saleItem
  ) {
    items.map(function(item) {
      if (item.customSku == saleItem.customSku) {
        saleItem["itemID"] = item["itemID"];
        saleItem["customSku"] = item["customSku"];
      }
    });
    return saleItem;
  });
  return sale;
});
// console.log(sale["SaleLines"]);

let newSales = JSON.stringify(sales);

fs.writeFileSync("./temp/newSales.json", newSales);
