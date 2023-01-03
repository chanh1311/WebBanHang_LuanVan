// Define function custom class active
function removeActive() {
    let imgActive = document.querySelector('.active');
    imgActive.classList.remove('active');
}

// ********************* Slider Index **************************
// Get element
const rightbtn = document.querySelector('.fa-chevron-right');
const leftbtn = document.querySelector('.fa-chevron-left');
const imgNumber = document.querySelectorAll(
    '.slider-content-left-top img',
).length;
const imgNumberLi = document.querySelectorAll('.slider-content-left-bottom li');

if (rightbtn && leftbtn && imgNumber && imgNumberLi) {
    // Define Function Slider
    function slider() {
        document.querySelector('.slider-content-left-top').style.right =
            index * 100 + '%';
        removeActive();
        imgNumberLi[index].classList.add('active');
    }

    // Event Click left,right
    let index = 0;
    rightbtn.addEventListener('click', function () {
        index = index + 1;
        if (index > imgNumber - 1) {
            index = 0;
        }
        slider();
    });

    leftbtn.addEventListener('click', function () {
        index = index - 1;
        if (index < 0) {
            index = imgNumber - 1;
        }
        slider();
    });

    // Event Click Title
    imgNumberLi.forEach(function (element, i) {
        element.addEventListener('click', function () {
            index = i;
            removeActive();
            document.querySelector('.slider-content-left-top').style.right =
                i * 100 + '%';
            element.classList.add('active');
        });
    });

    // Slider 3 ********************

    // Define function auto Slider
    function imgAuto() {
        index = index + 1;
        if (index > imgNumber - 1) {
            index = 0;
        }
        slider();
    }
    // Use function auto Slider
    setInterval(imgAuto, 7000);
}

// ********************Slider Product*******************//

// Get Element
const rightbtnTwo = document.querySelector('.fa-chevron-right-two');
const leftbtnTwo = document.querySelector('.fa-chevron-left-two');
const divItemsNumber = document.querySelectorAll(
    '.slider-product-one-content-items',
).length;

// Click left,right
if (rightbtnTwo && leftbtnTwo && divItemsNumber) {
    let i = 0;
    // console.log(divItemsNumber)
    rightbtnTwo.addEventListener('click', function () {
        i = i + 1;
        if (i > divItemsNumber - 1) {
            i = 0;
        }
        document.querySelector(
            '.slider-product-one-content-items-content',
        ).style.right = i * 100 + '%';
    });

    leftbtnTwo.addEventListener('click', function () {
        i = i - 1;
        if (i < 0) {
            i = divItemsNumber - 1;
        }
        document.querySelector(
            '.slider-product-one-content-items-content',
        ).style.right = i * 100 + '%';
    });
}

// ********************Slider Detail Product*******************//
// Get element

const rightbtnThree = document.querySelector('.fa-chevron-right-three');
const leftbtnThree = document.querySelector('.fa-chevron-left-three');
const imgItemsNumber = document.querySelectorAll(
    '.detail-product-contain-content-left-slider img',
).length;
const titleImg = document.querySelectorAll(
    '.detail-product-contain-content-left-title li',
);

if (rightbtnThree && leftbtnThree && imgItemsNumber && titleImg) {
    let num = 0;
    // Event Click left,right
    rightbtnThree.addEventListener('click', function () {
        num = num + 1;
        if (num > imgItemsNumber - 1) {
            num = 0;
        }
        document.querySelector(
            '.detail-product-contain-content-left-slider',
        ).style.right = num * 100 + '%';
    });

    leftbtnThree.addEventListener('click', function () {
        num = num - 1;
        if (num < 0) {
            num = imgItemsNumber - 1;
        }
        document.querySelector(
            '.detail-product-contain-content-left-slider',
        ).style.right = num * 100 + '%';
    });

    // Event Click title
    titleImg.forEach(function (element, i) {
        element.addEventListener('click', function () {
            num = i;
            removeActive();
            document.querySelector(
                '.detail-product-contain-content-left-slider',
            ).style.right = num * 100 + '%';
            element.classList.add('active');
        });
    });
}

// ***********************Remove atribute hidden raiting***********************
// Get element
var btnRaiting = document.querySelector('#btn-raiting');
var formRaitingHidden = document.querySelector('#form-raiting-hidden');
if (btnRaiting) {
    btnRaiting.addEventListener('click', function () {
        formRaitingHidden.removeAttribute('hidden');
    });
}

// *********************Slider Product Category**************************

// Get element

const rightbtnCategory = document.querySelector('.fa-chevron-right-category');
const leftbtnCategory = document.querySelector('.fa-chevron-left-category');
const imgItemsNumberCategory = document.querySelectorAll(
    '.product-category-contain-banner-top img',
).length;
const titleImgCategory = document.querySelectorAll(
    '.product-category-contain-banner-bottom li',
);

if (
    rightbtnCategory &&
    leftbtnCategory &&
    imgItemsNumberCategory &&
    titleImgCategory
) {
    let index = 0;

    // Define Function Slider
    function slider() {
        document.querySelector(
            '.product-category-contain-banner-top',
        ).style.right = index * 100 + '%';
        removeActive();
        titleImgCategory[index].classList.add('active');
    }

    // Event Click left,right

    rightbtnCategory.addEventListener('click', function () {
        index = index + 1;
        if (index > imgItemsNumberCategory - 1) {
            index = 0;
        }
        slider();
    });

    leftbtnCategory.addEventListener('click', function () {
        index = index - 1;
        if (index < 0) {
            index = imgItemsNumberCategory - 1;
        }
        slider();
    });
    // Click Title
    // Event Click Title
    titleImgCategory.forEach(function (element, i) {
        element.addEventListener('click', function () {
            index = i;
            removeActive();
            document.querySelector(
                '.product-category-contain-banner-top',
            ).style.right = i * 100 + '%';
            element.classList.add('active');
        });
    });

    // Auto Slider
    // Define function auto Slider
    function imgAuto() {
        index = index + 1;
        if (index > imgItemsNumberCategory - 1) {
            index = 0;
        }
        slider();
    }
    // Use function auto Slider
    setInterval(imgAuto, 5000);
}

// ********************Hidden Discount Code***************************
// Get element
var btnDiscountCode = document.querySelector('#discount-code');
var inputDiscountHidden = document.querySelector('.cart-code-input');

if (btnDiscountCode) {
    btnDiscountCode.addEventListener('click', function () {
        if (inputDiscountHidden.hasAttribute('hidden')) {
            inputDiscountHidden.removeAttribute('hidden');
        } else {
            inputDiscountHidden.setAttribute('hidden', 'true');
        }
    });
}

// ********************Hidden Input Address***************************
// Get element
var btnInputAddress = document.querySelector('#btnInputAddress');
var inputAddressHidden = document.querySelector(
    '.cart-information-main-address',
);
let selectAddressDefault = document.querySelector('.select-address-default');
let radioAddressOther = document.querySelector('#addressOther');

if (btnInputAddress) {
    btnInputAddress.addEventListener('click', function () {
        if (inputAddressHidden.hasAttribute('hidden')) {
            inputAddressHidden.removeAttribute('hidden');
            selectAddressDefault.setAttribute('hidden', 'true');
            radioAddressOther.setAttribute('required', 'true');
        } else {
            inputAddressHidden.setAttribute('hidden', 'true');
            selectAddressDefault.removeAttribute('hidden');
            radioAddressOther.removeAttribute('required');
        }
    });
}

// ************************ DataTables *****************************//
$(document).ready(function () {
    $('#dataHistoryOrder').DataTable({
        "order": [[3, 'desc'],[5, 'desc']]
    });
});



//****************************Load more product*************************** */
$(document).ready(function () {
    $('.product-item-display').slice(0,9).show();
    $("#btn-loadMore").click(function(e){ // click event for load more
        e.preventDefault();
        $(".product-item-display:hidden").slice(0, 9).show(); // select next 9 hidden divs and show them
        if($(".product-item-display:hidden").length == 0){ // check if any hidden divs still exist
            $("#btn-loadMore").hide();
        }
    });
});

//****************************Load more Rate*************************** */
$(document).ready(function () {
    $('.content-item-rate-hidden').slice(0,4).show();
    $("#btn-loadRateMore").click(function(e){ // click event for load more
        e.preventDefault();
        $(".content-item-rate-hidden:hidden").slice(0, 4).show(); // select next 9 hidden divs and show them
        if($(".content-item-rate-hidden:hidden").length == 0){ // check if any hidden divs still exist
            $("#btn-loadRateMore").hide();
            $("#btn-hiddenRate").show();
        }
    });
    $("#btn-hiddenRate").click(function(e){
        e.preventDefault();
        $('.content-item-rate-hidden').hide();
        $("#btn-hiddenRate").hide();
        $("#btn-loadRateMore").show();
        
    })
});



//***************************Check category product *****************************/
$(document).ready(function () {
    var elementCategoryDefault = $('#flexCheckCategoryDefault');
    var elementsCategory = $('input[name="flexCheckCategory[]"]');
    

    var elementPriceDefault = $('#flexCheckPriceDefault');
    var elementsPrice = $('input[name="flexCheckPrice[]"]');
    

    var elementSpecialDefault = $('#flexCheckSpecialDefault');
    var elementsSpecial = $('input[name="flexCheckSpecial[]"]');
    

    var elementPinDefault = $('#flexCheckPinDefault');
    var elementsPin = $('input[name="flexCheckPin[]"]');
    

    var elementScreenDefault = $('#flexCheckScreenDefault');
    var elementsScreen = $('input[name="flexCheckScreen[]"]');
    

    var elementCamDefault = $('#flexCheckCamDefault');
    var elementsCam = $('input[name="flexCheckCam[]"]');
    
   
    if(elementCategoryDefault && elementsCategory){
        // click all
        elementCategoryDefault.click(function(e){
            elementsCategory.prop('checked',false);
            
            if(!elementCategoryDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsCategory.click(function(e){
            if($('input[name="flexCheckCategory[]"]:checked').length > 0){
                elementCategoryDefault.prop('checked',false);
            }else{
                elementCategoryDefault.prop('checked',true);
            }
        })

        
        
    }


    // 2
    if(elementPriceDefault && elementsPrice){
        // click all
        elementPriceDefault.click(function(e){
            elementsPrice.prop('checked',false);
            if(!elementPriceDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsPrice.click(function(e){
            if($('input[name="flexCheckPrice[]"]:checked').length > 0){
                elementPriceDefault.prop('checked',false);
            }else{
                elementPriceDefault.prop('checked',true);
            }
        })
    }

    //3
    if(elementSpecialDefault && elementsSpecial){
        // click all
        elementSpecialDefault.click(function(e){
            elementsSpecial.prop('checked',false);
            if(!elementSpecialDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsSpecial.click(function(e){
            if($('input[name="flexCheckSpecial[]"]:checked').length > 0){
                elementSpecialDefault.prop('checked',false);
            }else{
                elementSpecialDefault.prop('checked',true);
            }
        })
    }
    //4
    if(elementPinDefault && elementsPin){
        // click all
        elementPinDefault.click(function(e){
            elementsPin.prop('checked',false);
            if(elementPinDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsPin.click(function(e){
            if($('input[name="flexCheckPin[]"]:checked').length > 0){
                elementPinDefault.prop('checked',false);
            }else{
                elementPinDefault.prop('checked',true);
            }
        })
    }
    //5
    if(elementScreenDefault && elementsScreen){
        // click all
        elementScreenDefault.click(function(e){
            elementsScreen.prop('checked',false);
            if(!elementScreenDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsScreen.click(function(e){
            if($('input[name="flexCheckScreen[]"]:checked').length > 0){
                elementScreenDefault.prop('checked',false);
            }else{
                elementScreenDefault.prop('checked',true);
            }
        })
    }
    //6
    if(elementCamDefault && elementsCam){
        // click all
        elementCamDefault.click(function(e){
            elementsCam.prop('checked',false);
            if(!elementCamDefault.prop('checked')){
               e.preventDefault();
            }
            
        })
        // click items
        elementsCam.click(function(e){
            if($('input[name="flexCheckCam[]"]:checked').length > 0){
                elementCamDefault.prop('checked',false);
            }
        })
    }


});


//**************************** When Click Checkbox  ****************************/


$(document).ready(function(){
    // get params
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

    // get params sort from url
    let valueSort = params._sort;
    if(!valueSort){
        valueSort = 'banchaynhat';
    }

    const categoryCheck = $('input[name="flexCheckCategory[]"]');
    const priceCheck = $('input[name="flexCheckPrice[]"]');
    const specialCheck = $('input[name="flexCheckSpecial[]"]');
    const pinCheck = $('input[name="flexCheckPin[]"]');
    const screenCheck = $('input[name="flexCheckScreen[]"]');
    const camCheck = $('input[name="flexCheckCam[]"]');

    const categoryAll = $('.category-all');
    const priceAll = $('.price-all');
    const specialAll = $('.special-all');
    const pinAll = $('.pin-all');
    const screenAll = $('.screen-all');
    const camAll = $('.cam-all');

    var categoryCheckArr,priceCheckArr,specialCheckArr,pinCheckArr,screenCheckArr,camCheckArr  = [];
    var categoryParams,priceParams,specialParams,pinParams,screenParams,camParams;

    function checkedRedirectUrl(check1,check2,check3,check4,check5,check6){
        check1.add(check2).add(check3).add(check4).add(check5).add(check6).click(function(){
            categoryCheckArr = $('input[name="flexCheckCategory[]"]:checked').map(function(){
                                    return $(this).val();
                                }).get();
            priceCheckArr = $('input[name="flexCheckPrice[]"]:checked').map(function(){
                                    return $(this).val();
                            }).get();
            specialCheckArr = $('input[name="flexCheckSpecial[]"]:checked').map(function(){
                                    return $(this).val();
                            }).get();
            pinCheckArr = $('input[name="flexCheckPin[]"]:checked').map(function(){
                                    return $(this).val();
                            }).get();
            screenCheckArr = $('input[name="flexCheckScreen[]"]:checked').map(function(){
                                    return $(this).val();
                            }).get();
            camCheckArr = $('input[name="flexCheckCam[]"]:checked').map(function(){
                                    return $(this).val();
                            }).get();
            categoryParams = categoryCheckArr.join(',');
            priceParams = priceCheckArr.join(',');
            specialParams = specialCheckArr.join(',');
            pinParams = pinCheckArr.join(',');
            screenParams = screenCheckArr.join(',');
            camParams = camCheckArr.join(',');
    
            // parse param
            categoryParams = `${categoryParams ? `category=${categoryParams}` : categoryParams}`;
            priceParams = `${priceParams ?  `price=${priceParams}` : priceParams}`;
            specialParams = `${specialParams ? `special=${specialParams}` : specialParams}`;
            pinParams = `${pinParams ? `pin=${pinParams}` : pinParams}`;
            screenParams = `${screenParams ?  `screen=${screenParams}` : screenParams}`;
            camParams = `${camParams ?  `cam=${camParams}` : camParams}`;
    
            window.location.href = 
            `/category?_sort=${valueSort}${categoryParams ? `&${categoryParams}` : categoryParams}${ priceParams ?  `&${priceParams}` : priceParams}${specialParams ? `&${specialParams}` : specialParams}${pinParams ? `&${pinParams}` : pinParams}${screenParams ? `&${screenParams}` : screenParams}${camParams ? `&${camParams}` : camParams}`;
            
        });

    }
    checkedRedirectUrl(categoryCheck,priceCheck,specialCheck,pinCheck,screenCheck,camCheck);
    checkedRedirectUrl(categoryAll,priceAll,specialAll,pinAll,screenAll,camAll);

    
    
  
    
});


// ------------ When Click Sort ----------------- //
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
}

$(document).ready(function(){
    var value = 'banchaynhat';
    var url;
    const sortElements = $('.sort-elements');
    const sortElementsSelect = $('#sort-elements-select');
    console.log(sortElementsSelect)
    sortElements.click(function(){
        value = $(this).val();
        url = updateQueryStringParameter(window.location.href,'_sort',value);
        window.location.href = url;
    })
    sortElementsSelect .change(function(){
        value = $(this).val();
        url = updateQueryStringParameter(window.location.href,'_sort',value);
        window.location.href = url;
    })
});


// ************************** ORDER ****************************//

//info
// var infoUser = $('.info-user');
// var tagMessageInfo = $('.tag-message-info');

// //address
// var infoAddress = $('.info-address');
// var tagMessageAddress = $('.tag-message-address');
// var radioAddress = $('.radio-address');

// var valid = true;



// // info
// infoUser.on('blur change input',function(){
//     if($('.info-user').get().every(e => e.value)){
//         tagMessageInfo.prop('hidden',true);
//         valid = true;
//     }else{
//         valid = false;
//         tagMessageInfo.removeAttr('hidden');
//     }

// })

// // address

// infoAddress.on('blur change input',function(){
//     if($('.info-address').get().every(e => e.value)){
//         radioAddress.prop('checked', false);
//         radioAddress.attr('disabled', true);
//         valid = true;
//     }else{
//         radioAddress.attr('disabled', false);;
//         if($('.radio-address:checked').length == 0){
//             tagMessageAddress.prop('hidden',false);
//             valid = false;
//         }else{
//             valid = true;
//             tagMessageAddress.prop('hidden',true);
//         }
//     }
// });

// radioAddress.on('change',function(){
//     if($('.radio-address:checked').length > 0)
//         tagMessageAddress.prop('hidden',true);
//         valid = true;
// })

// ***************** Edit Profile ********************// 
$(document).ready(function() {
    let editAddress = $('.editAddress');
    let editAddressHidden = $('.editAddressHidden');
    let deleteAddress = $('.deleteAddress');
    let addAddress = $('.addAddress');
    let addAddressHidden = $('.addAddressHidden');
    if(editAddress && deleteAddress && editAddressHidden && addAddress){
        editAddress.click(function(e){
            e.preventDefault();
            editAddressHidden.attr('hidden',false);
        })
        addAddress.click(function(e){
            e.preventDefault();
            addAddressHidden.attr('hidden',false);
        })
    }

})
  

// ********************* Review % *********************//
