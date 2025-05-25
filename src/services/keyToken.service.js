'use strict'
const keytokenModel = require('../models/keyToken.model')
class KeyTokenService {
    static createKeyToken = async({userId, publicKey}) => {
        try {
            const publicKeyString = publicKey.toString()
            const token = await keytokenModel.create({
                userId,
                publicKey: publicKeyString
            })
            return token ? token.publicKey: null
        } catch (error) {
            return error
        }
    }
}
module.exports = KeyTokenService