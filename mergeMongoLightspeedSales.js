const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const items = JSON.parse(fs.readFileSync("./temp/Items.json"));

const uri =
  "mongodb+srv://darryl:5NtB4QBp8N6CbcQ@shooting-supplies-43b7z.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  if (err) console.error(err);
  const collection = client.db("opSuiteData").collection("sales");
  const items = JSON.parse(fs.readFileSync("./temp/Items.json"));

  console.log(items.Item);

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
            QtySold
          } = x;
          return {
            employeeId: 1,
            registerID: 1,
            shopID: 1,
            completed: true,
            completeTime: TransactionDate,
            referenceNumber: TransactionNumber,
            referenceNumberSource: "opSuite",
            SaleLines: {
              SaleLine: [
                {
                  itemID: ItemSku,
                  unitQuantity: QtySold,
                  ItemDescription,
                  Supplier,
                  Cost,
                  Price,
                  Tax,
                  TotalSales
                }
              ]
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
      fs.writeFileSync("./temp/sales.json", JSON.stringify(na, null, 2));
    });
});
