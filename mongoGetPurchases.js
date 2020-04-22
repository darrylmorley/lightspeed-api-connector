const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const uri =
  "mongodb+srv://darryl:5NtB4QBp8N6CbcQ@shooting-supplies-43b7z.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  if (err) console.error(err);
  const collection = client.db("opSuiteData").collection("purchaseOrders");

  collection
    .find({})
    .toArray()
    .then(purchases => {
      jsonData = JSON.stringify(purchases);
      fs.writeFileSync("./temp/purchaseOrders.json", jsonData);
      client.close();
    });
});
