const redis = require('ioredis')

const connect = new redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

const storeRecipesInRedis = (data, total) => {
    const dataRedis = JSON.stringify(data);
    connect.setex('recipes', 5, dataRedis, (err) => {
      if (err) {
        console.error('Error storing data in Redis:', err);
      } else {
        console.log('Data stored in Redis');
      }
    });
    const totalRedis = JSON.stringify(total);
    connect.setex('total', 5, totalRedis, (err) => {
        if (err) {
            console.error('Error storing data in Redis:', err);
        } else {
            console.log('Data stored in Redis');
        }
        }
    );
  };
  
const getRecipesRedis = (req, res, next) => {
    connect.get('recipes', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        }

        if (data !== null) {
            const result = JSON.parse(data)
            const total = connect.get('total')
            return res.status(200).json({
                status: true,
                message: 'Get data from redis success',
                data: result
              })
        } else {
            next()
        }
    })
}

module.exports = {
    storeRecipesInRedis,
    getRecipesRedis,
    connect
}