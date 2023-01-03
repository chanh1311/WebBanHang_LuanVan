
let total = $('input[name="total"]');
let btnPayWithPaypal = $('#paypal-button-container');
let fullname = $('input[name="fullname"]');
let address = $('input[name="address"]');
let addressOther = $('input[name="addressOther"]');
let phone = $('input[name="phone"]');
let discount = $('#discount-code-input');
function getOrder(){
  const order = {
    fullname: fullname ? fullname.val() : '',
    total : total ? total.val() : '',
    phone: phone ? phone.val() : '',
    address: address ? address.val() : '',
    addressOther: addressOther ? addressOther.val() : '',
    discount: discount ? discount.val() : ''
  }
  return order;
}



function validateForm(fullname,addressOther,phone){
 
  let valueFullname = fullname.val();
  let valueAddressOther = addressOther.val();
  let valuePhone = phone.val();
  //
  if(!valueFullname || !valueAddressOther || !valuePhone){
    return false;
  }
  return true;
}

function validateFormNotAddress(fullname,phone){
  let valueFullname = fullname.val();
  let valuePhone = phone.val();
  //
  if(!valueFullname || !valuePhone){
    return false;
  }
  return true;
}



paypal
  .Buttons({
      onInit:  function(data, actions) {
        
        let isValid = validateForm(fullname,addressOther,phone);
        let isValidNotAddress = validateFormNotAddress(fullname,phone);
            
        let checkHiden = document.querySelector('input[name="addressOther"]').closest('.form-group').hasAttribute('hidden');

        if (!checkHiden) {
          if(isValid) actions.enable();
          else actions.disable();
        } else  {
          if(isValidNotAddress) actions.enable();
          else actions.disable();
        }   
        // Listen for changes to the checkbox
        document.querySelectorAll('.isvalid').forEach(function(obj){
          obj.addEventListener('change', function(event) {
              let isValid = validateForm(fullname,addressOther,phone);
              let isValidNotAddress = validateFormNotAddress(fullname,phone);
            
              
              // Enable or disable the button when it is checked or unchecked
              let checkHiden = event.target.closest('.form-group').hasAttribute('hidden');
              if (!checkHiden) {
                if(isValid) actions.enable();
                else actions.disable();
              } else  {
                if(isValidNotAddress) actions.enable();
                else actions.disable();
              }   
          });
        })
    },
    onClick :  function(){
      document.querySelectorAll('.isvalid').forEach(function(obj){
            let message = 'Vui lòng nhập trường này!';
            let checkHiden = obj.closest('.form-group').hasAttribute('hidden');
            if (!obj.value && !checkHiden) {
                console.log(obj.closest('.form-group'));
                obj.closest('.form-group').querySelector('.form-message').textContent = message;
            }else{
              obj.closest('.form-group').querySelector('.form-message').textContent = '';
            }    
        });
      
    },
    createOrder: function (data, actions) {
      let totalUSD = $('.btn-input-totalUSD').val();
      return fetch("/checkout/checkout-paypal", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify({totalUSD: totalUSD})
      })
        .then((response) => response.json())
        .then((response) => {
        //     console.log('response is...');
        //   console.log(response);
        //   console.log(response.id);
          return response.id;
        });
    },

    // Finalize the transaction after payer approval
    onApprove: function (data, actions) {
      let order = getOrder();
      return fetch(`/checkout/${data.orderID}/checkout-paypal-success`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(order)
      })
        .then((response) => response.json())
        .then(function (orderData) {
          // Successful capture! For dev/demo purposes:
          if(orderData){
            window.location.href = '/checkout/checkout-paypal-success';
          }
        });
    },
  })
  .render("#paypal-button-container");