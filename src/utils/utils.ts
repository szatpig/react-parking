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

const Debounce = function (fn:any, wait:number) {
    let timeout:any = null;
    return function() {
        if(timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}

const Throttle = function(fn:any, delay:number) {
    let prev = Date.now();
    return function() {
        let now = Date.now();
        if (now - prev >= delay) {
            fn.apply(arguments);
            prev = Date.now();
        }
    }
}

export {
    Debounce,
    Throttle,
    EncryptStr
}