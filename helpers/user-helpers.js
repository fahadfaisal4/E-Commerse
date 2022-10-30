const db = require("../config/connection")
const collectionNames = require("../config/collections")
const bcrypt = require("bcrypt")


function ObjectId(id) {
    return myObjectIdString = id.toString()
}

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collectionNames.USER_COLLECTION).insertOne(userData).then((resultData) => {
                const userId = resultData.insertedId
                const userIdString = userId.toString()
                resolve(userIdString)
            })
        })

    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collectionNames.USER_COLLECTION).findOne({ email: userData.email })

            if (user) {
                bcrypt.compare(userData.password, user.password).then(result => {
                    if (result) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    addToCart: (prodId, usrID) => {
        console.log(`porduid : ${prodId}`);
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collectionNames.CART_COLLECTION).findOne({ user: ObjectId(usrID) })
            console.log(userCart)
            if (userCart) {
                db.get().collection(collectionNames.CART_COLLECTION).updateOne({ user: ObjectId(usrID) },
                    {

                        $push: { products: ObjectId(prodId) }

                    }
                ).then(res => {
                    resolve()
                })
            }

            else {
                const cartObj = {
                    user: ObjectId(usrID),
                    products: [ObjectId(prodId)]
                }
                db.get().collection(collectionNames.CART_COLLECTION).insertOne(cartObj).then(res => {
                    console.log(res);
                    resolve(res)
                })
            }
        })
    }
}