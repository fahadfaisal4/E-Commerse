const db = require("../config/connection")
const collectionNames = require("../config/collections");
const ObjectId = require("mongodb").ObjectId


module.exports = {
  addProduct: (product, callback) => {
    db.get().collection('products').insertOne(product).then((data) => {
      const myObjectId = data.insertedId
      const myObjectIdString = myObjectId.toString()
      callback(myObjectIdString)
    })
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      const products = await db.get().collection(collectionNames.PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },

  deleteProduct: (prodId) => {
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collectionNames.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(prodId) }).then(result => {
        resolve()
      })
    })
  },
  getProduct: (prodId) => {
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collectionNames.PRODUCT_COLLECTION).findOne({ _id: ObjectId(prodId) }).then(result => {
        resolve(result)
      })
    })
  },
  editProduct: (prodId, prodData) => {
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collectionNames.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prodId) },
        {
          $set: {
            name: prodData.name,
            category: prodData.category,
            price: prodData.price,
            description: prodData.description
          }
        }).then(result => {
          resolve()
        })
    })
  },
  getCartProducts:(usrId)=>{
    return new Promise((resolve, reject) => {
      const cartItems = db.get().collection(collectionNames.CART_COLLECTION).aggregate([
        {
          $match:{user:ObjectId(usrId)}
        },
        {
          $lookup:{
            from:collectionNames.CART_COLLECTION
            let:{products:$collectionNames.CART_COLLECTION}
          }
        }
      ])
    })
  }
};
