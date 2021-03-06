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

const Throttle = function(fn:any, wait:number) {
    let timer:any
    return (...args:any) => {
        if (timer) { return }
        timer = setTimeout(() => {
            fn(...args)
            timer = null
        }, wait)
    }
}

export {
    Debounce,
    Throttle,
    EncryptStr
}