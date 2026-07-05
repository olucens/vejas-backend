"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt = require("bcrypt");
const saltRound = Number(process.env.CRYPT_SALT) || 5;
async function hashPassword(pass) {
    try {
        const hashed = await bcrypt.hash(pass, saltRound);
        return hashed;
    }
    catch (error) {
        console.error('hashPassword error', error);
        throw error;
    }
}
async function comparePassword(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    }
    catch (error) {
        console.error('Comparison error:', error);
        throw error;
    }
}
//# sourceMappingURL=hashPassword.js.map