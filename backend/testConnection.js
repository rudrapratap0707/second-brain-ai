const { MongoClient, ServerApiVersion } = require("mongodb")

const uri =
  "mongodb://second-brain-cluster:Rudra2004%40@ac-rb9jk2k-shard-00-00.97afr6q.mongodb.net:27017,ac-rb9jk2k-shard-00-01.97afr6q.mongodb.net:27017,ac-rb9jk2k-shard-00-02.97afr6q.mongodb.net:27017/secondbrain?ssl=true&authSource=admin&replicaSet=atlas-rb9jk2k-shard-0&retryWrites=true&w=majority"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    await client.connect()

    await client.db("admin").command({ ping: 1 })

    console.log(
      "✅ Pinged your deployment. Successfully connected to MongoDB!"
    )
  } catch (error) {
    console.log("❌ MongoDB Connection Error:")
    console.log(error)
  } finally {
    await client.close()
  }
}

run()