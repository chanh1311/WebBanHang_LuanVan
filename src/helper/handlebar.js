var moment = require('moment');

const Handlebars = require('Handlebars');
module.exports = {
    sum: (a, b) => a + b,
    sortAble: (field, sort) => {
        // field thì được truyền vào, sort.column là biến nằm trên url

        var isSelected =
            field === sort.column && ['asc', 'desc'].includes(sort.type)
                ? sort.type
                : 'default';

        var icons = {
            default: '<i class="bi bi-filter"></i>',
            asc: '<i class="bi bi-sort-down-alt"></i>',
            desc: '<i class="bi bi-sort-down"></i>',
        };
        var types = {
            default: 'asc',
            asc: 'desc',
            desc: 'asc',
        };

        var icon = icons[isSelected];
        var type = types[isSelected];

        var href = Handlebars.escapeExpression(
            `?_sort&column=${field}&type=${type}`,
        );
        const output = `<a href="${href}">
                    ${icon}
                </a>`;
        return new Handlebars.SafeString(output);
    },
    limit: (arr, limit) => {
        if (!Array.isArray(arr) || arr.length < limit) {
            return [];
        }
        
        return arr.reverse().slice(0, limit);
    },
    slice: (arr, first, last) => {
        
        if (!Array.isArray(arr) ) {
            
            return [];
        }
        if(arr.length < last) return arr.slice(first,arr.length);
        
        return arr.slice(first, last);
    },
    sort: (arr, field, match) => {
        if (!Array.isArray(arr)) {
            return [];
        }
        if (match === 'desc') {
            return arr.sort((a, b) => `${a}.${field}` - `${b}.${field}`);
        } else if (match === 'asc') {
            return arr.sort((a, b) => `${b}.${field}` - `${a}.${field}`);
        }
    },
    sortandslice: (arr, field, match, first, last) => {
        if (!Array.isArray(arr) || (arr.length < last)) {
            return [];
        }
        let result = arr.slice(0);

        if (match === 'desc') {
            result = result.sort((a, b) => b.giam - a.giam);
        } else if (match === 'asc') {
            result = result.sort((a, b) => a.giam - b.giam);
        }
        return result.slice(first, last);
    },
    sortbuyandslice: (arr, field, match, first, last) => {
        if (!Array.isArray(arr) || arr.length < last) {
            return [];
        }
        let result = arr.slice(0);

        if (match === 'desc') {
            result = result.sort((a, b) => b.soluongmua - a.soluongmua);
        } else if (match === 'asc') {
            result = result.sort((a, b) => a.soluongmua - b.soluongmua);
        }
        // [field]
        return result.slice(first, last);
    },
    parsePrice: (arr) => {
        if (!Array.isArray(arr) && typeof arr != 'number') {
            return [];
        }
        if(typeof arr == 'number'){
            arr = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(arr);
            
            return arr;
        }
        arr.forEach(function (obj) {
            obj.giam = parseInt(obj.giam * 100);
            obj.giagoc = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(obj.giagoc);
            obj.gia = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(obj.gia);
            obj.giaqua = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(obj.giaqua); 
        });
        
        
    },
 
    checkLengthThanNum: (arr, len) => {
        if (!Array.isArray(arr)) {
            return false;
        }
        if (arr.length < len) return false;
        return true;
    },
    functionRates: (arr) => {
        const len = arr.length;
        const count1 = arr.filter((obj) => obj.sosao === 1).length;
        const count2 = arr.filter((obj) => obj.sosao === 2).length;
        const count3 = arr.filter((obj) => obj.sosao === 3).length;
        const count4 = arr.filter((obj) => obj.sosao === 4).length;
        const count5 = arr.filter((obj) => obj.sosao === 5).length;
        const perReview1 = ((count1/len)*100);
        const perReview2 = ((count2/len)*100);
        const perReview3 = ((count3/len)*100);
        const perReview4 = ((count4/len)*100);
        const perReview5 = ((count5/len)*100);
        
        let avg = (arr.reduce((total, next) => total + next.sosao, 0)/len).toFixed(1);
        if(isNaN(avg)) avg = 5;
        return {
            'len': len,
            'count1': count1,
            'count2': count2,
            'count3': count3,
            'count4':count4,
            'count5':count5,
            'avg':avg,
            perReview1,
            perReview2,
            perReview3,
            perReview4,
            perReview5
        }
    },

    review: (arr,sosao) => {
        const len = arr.length;
        const count = arr.filter((obj) => obj.sosao === sosao).length;
        return (count/len) * 100;
    },
    ifleq: (sosao,sosaodg) => {
        let result = parseInt(sosaodg);
        if(result >= sosao){
            return true;
        }
        return false;
    },
    ifEquals: (arr,str) => {
        if(typeof arr != 'undefined'){
            return (arr.includes(str) || arr === str);
        }
           
        return false;
    },
    ifEqualsString: (str1,str2) => {
        if(str1){
            return (str1.toString() === str2);
        }
           
        return false;
    },
    isUndefined: (str1) => {
        
        return (typeof str1 === 'undefined' || str1 == '' || str1 == 'all');
    },
    checkUndefined: (status) => {
        
        return (typeof status === 'undefined');
    },
    test: (obj) => {
       console.log(obj);
    },
    getNameProduct: (obj) => {
        
        if(obj){
            const listNameProduct = obj.sanphammua.map(function(element){
                if(element.idProduct != null){
                    return element.idProduct.tensanpham;
                }else{
                    return [];
                }
                
            });
            
            return listNameProduct.join(', ');
        }
    },
    sliceId: (id,num) => {
        if(id != undefined && id != ''){
            id = id.toString();
            return id.substr(-6);
        }else{
            return id;
        }
        
    },
    convertDate: (strDate) => {
        if(strDate){
            return moment(strDate).format('L, LT');
        }
        return strDate;
    },
    convertPrice: (price) => {
        price = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
        
        return price;
    },
    convertUSD: (price) => {
        
        return ((price * 0.00004 * 100) / 100).toFixed(2);
    },
    getProductFromOrders: (arrData) => {

    },
    convertGiam: (price) => {
        price = parseInt(price * 100);
        return price;
    }
    ,
    resultPrice: (price,discount) => {
        
    },
    json: function(obj) {
        return JSON.stringify(obj);
    },
    percent: function(obj){
        let objCopy = {...obj};
        const sumValues = Object.values(objCopy).reduce((a, b) => a + b, 0);
        Object.keys( objCopy).forEach(key =>  objCopy[key] = Math.round(( objCopy[key] / sumValues) * 100));
        return objCopy;
    },
    joinArrCode: (arr) => {
        if(arr && Array.isArray(arr) && arr.length != 0){
            let result = arr.map(obj => {
                return `${obj.key}: ${obj.value}` 
            });
            return result.join('\n');
        }
            
    },
    mapProductBuyWithEmail: (arr,objProduct) => {
        if(arr && Array.isArray(arr) && arr.length != 0 && objProduct){
           arr.forEach(obj => {
                obj.sodondamua = objProduct[obj.email] ? objProduct[obj.email] : 0;
           })
        }
    }
};
