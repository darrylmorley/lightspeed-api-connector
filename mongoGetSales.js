const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
var moment = require("moment");

const uri =
  "mongodb+srv://darryl:5NtB4QBp8N6CbcQ@shooting-supplies-43b7z.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  if (err) console.error(err);
  const collection = client.db("opSuiteData").collection("sales");

  collection
    .find({})
    .toArray()
    .then(sales => {
      salesOrders = sales;
      client.close();

      let na = salesOrders
        .map(x => {
          let {
            TransactionNumber,
            ItemSku,
            ItemDescription,
            Supplier,
            Price,
            Cost,
            TotalSales,
            TransactionDate,
            Tax,
            QtySold,
            TransactionTotalSales
          } = x;
          return {
            employeeID: 1,
            registerID: 1,
            shopID: 1,
            completed: true,
            completeTime: moment(TransactionDate, "DD/MM/YYYY", true).format(),
            referenceNumber: TransactionNumber,
            referenceNumberSource: "opSuite",
            SaleLines: {
              SaleLine: [
                {
                  customSku: ItemSku,
                  unitQuantity: QtySold,
                  ItemDescription,
                  Supplier,
                  Cost,
                  Price,
                  Tax,
                  TotalSales
                }
              ]
            },
            SalePayments: {
              SalePayment: {
                amount: TransactionTotalSales,
                paymentTypeID: 1
              }
            }
          };
        })
        .reduce((a, v) => {
          if (a.every(x => x.referenceNumber !== v.referenceNumber)) {
            return [...a, v];
          }
          return a.map(x => {
            if (x.referenceNumber === v.referenceNumber) {
              x.SaleLines.SaleLine = x.SaleLines.SaleLine.concat(
                v.SaleLines.SaleLine
              );
            }
            return x;
          });
        }, []);
      console.log(na);
      fs.writeFileSync("./temp/sales.json", JSON.stringify(na, null, 2));
    });
});
