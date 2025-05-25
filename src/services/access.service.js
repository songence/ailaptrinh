'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async({name, email, password}) => {
        try {
            //step 1: check email exist??
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password, roles: [RoleShop.SHOP]
            })
            if(newShop) {
                //create privateKey, publicKey
                const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1', //pkcs8
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })//Public key CryptoGraphy Standards
                console.log(privateKey, publicKey) //save collection KeyStore
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publickey
                })
                if(!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    }
                }
                console.log(`PublicKeyString::`, publicKeyString)
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                console.log(`PublicKeyObject::`, publicKeyObject)
                //create token pair
                const tokens = await shopModel.createKeyTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Create Token Success::`, tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
                //const tokens = await
            }
            return {
                code: 200,
                metadata: null
            }
        } catch(error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}
module.exports = AccessService