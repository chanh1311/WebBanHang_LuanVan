// Delete Product
$(document).ready(function () {
    
    let formHiddenDelete = $('.form-hidden-product-admin');
   
    if(formHiddenDelete){
        $('#dataProduct').on('click','.deleteProductAdmin',function(e){
            e.preventDefault();
            let idProduct = $(this).val();
            let url = '/admin/delete-product/' + idProduct + '?_method=DELETE';
            console.log(url)
            formHiddenDelete.attr('action',url);
            
            formHiddenDelete.submit();
            
        });
    }
});
// // Update Product
$(document).ready(function () {
    // Display Inteface Update
    // console.log($('.updateProductAdmin')); --> Obj 10 items
    // Event Delegation
    $('#dataProduct').on('click','.updateProductAdmin',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/update-product/' + idProduct;
        
        window.location.href = url;
    })
    
       
    
    
});

// ---------------------- USER --------------------------- //
$(document).ready(function(e){
    let formUserLock  = $('.form-hidden-user-admin');
    // lock
    $('#dataUser').on('click','.btn-lock',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/lock-user/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })
    // unlock
    $('#dataUser').on('click','.btn-unlock',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/unlock-user/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })

})


// --------------------- ORDER ---------------------------//
$(document).ready(function(e){
    let formOrderHidden  = $('.form-hidden-order-admin');
    // confirm
    $('#dataOrder1').on('click','.btn-confirm-order',function(e){
        e.preventDefault();
        let idOrder = $(this).val();
        let url = '/admin/confirm-order/' + idOrder + '?_method=PATCH';
        formOrderHidden .attr('action',url);   
        formOrderHidden .submit();
    })
    // cancel
    $('#dataOrder1').on('click','.btn-cancel-order',function(e){
        e.preventDefault();
        let idOrder = $(this).val();
        let url = '/admin/cancel-order/' + idOrder + '?_method=PATCH';
        formOrderHidden .attr('action',url);   
        formOrderHidden .submit();
    })
    // 2
      // confirm
      $('#dataOrder2').on('click','.btn-confirm-order-success',function(e){
        e.preventDefault();
        let idOrder = $(this).val();
        let url = '/admin/confirm-order-success/' + idOrder + '?_method=PATCH';
        formOrderHidden .attr('action',url);   
        formOrderHidden .submit();
    })

})


// ********************* Account ********************//

$(document).ready(function(e){
    let formUserLock  = $('.form-hidden-account-admin');
    // lock
    $('#dataAccount').on('click','.btn-lock-account',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/lock-account/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })
    // unlock
    $('#dataAccount').on('click','.btn-unlock-account',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/unlock-account/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })

})

// Permistion
// ---------------------- USER --------------------------- //
$(document).ready(function(e){
    let formUserLock  = $('.form-hidden-account-admin');
    // lock
    $('#dataAccount').on('click','.btn-add-permistion',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/add-permistion-edit/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })
    // unlock
    $('#dataAccount').on('click','.btn-remove-permistion',function(e){
        e.preventDefault();
        let idProduct = $(this).val();
        let url = '/admin/remove-permistion-edit/' + idProduct + '?_method=PUT';
        formUserLock .attr('action',url);   
        formUserLock .submit();
    })

})
