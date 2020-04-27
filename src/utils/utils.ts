// Created by szatpig at 2019/9/30.
const { JSEncrypt } = require('jsencrypt')
const EncryptStr = (password:string,publicKey:string) =>{
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    let encrypted = encrypt.encrypt(password);
    if(encrypted === false){
        return password;
    }
    return encrypted;
}

export {
    EncryptStr
}