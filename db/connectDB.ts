import mongoose from "mongoose";
const dbUrl:string = process.env.DATABASE_URL!;

mongoose.connect(dbUrl).then(() => {
  console.log('Успешное подключение к базе данных');
}).catch((error) => {
  console.error('Ошибка подключения к базе данных:', error);
});

mongoose.connection.on('connected', () => {
  console.log('Подключено к базе данных MongoDB');
});


//mongo URI
// const client = new MongoClient(dbUrl, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const run = async () => {
//   try {
//     await client.connect();

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   }
//   finally {

//   }
// }

// run().catch(error => console.log)