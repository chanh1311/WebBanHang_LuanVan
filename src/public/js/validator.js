

// Dinh nghia doi tuong (options chứa các tham số được truyền(form,errorSelector,rules))
function Validator(options){
    // function get parent //
        /*
            function getParent(element,selector){
                while(element.parentElement){
                    if(element.parentElement.matches(selector)){
                        return element.parentElement;
                    }
                    element = element.parentElement;
                }
            }
        */
    var rulesSelector = {};
    
    // get editor
    var editor = options.data;
    
    // check field ckeditor
     // check error mota
     var fieldError = document.querySelector(options.fieldError);
    //  var fieldData = document.querySelector(options.fieldData);
    
    
    // Ham thuc hien validate 
    function validate(inputElement,rule){
        
         // Lấy tag error
         var errorElement = inputElement.closest(options.formGroup).querySelector(options.errorSelector);

        // Kiểm tra rule
        var errorMessage;
        var rules = rulesSelector[rule.selector];
        
        // Get message lỗi nhiều rule
        for(var i = 0; i < rules.length; ++i){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    var elementChecked = formElement.querySelector(rule.selector + ':checked');
                    var valueChecked = '';
                    if(elementChecked)
                        valueChecked =  elementChecked.value;
                    errorMessage = rules[i](
                        valueChecked
                    );    
                    
                break;
                default:
                    errorMessage = rules[i](inputElement.value);
                    break;
            }
            
            if(errorMessage) break;
        }// for
        // Nếu có lỗi thì hiển thị
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.closest(options.formGroup).classList.add('invalid');
            return false;
        }else{
            errorElement.innerText = '';
            inputElement.closest(options.formGroup).classList.remove('invalid');
            return true;
        }
    }// Validate







    // get form by ID (query selector)
    var formElement = document.querySelector(options.form);


    // if form tồn tại thì sẽ cho lặp qua các rules, ở mỗi rule sẽ có 2 trường(selector,test)
    if(formElement){
        // khi submit form 
        formElement.onsubmit = function(e){
            // bo hanh vi mặc định
            e.preventDefault();

            
            
            // Kiểm tra lỗi của form khi submit
            var isFormValid = true;

            
            // Lặp qua từng rule và validate luôn
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                
                // validate và nhận biến kt lỗi
                var isValid = validate(inputElement,rule); 

                // Nếu có lỗi
                if(!isValid){
                    isFormValid = false;
                }   
            })

            // validate ckeditor(mota)
            if(editor){
                var data = editor.getData();
            }
            
            if(!data && fieldError){
                fieldError.removeAttribute('hidden');
                isFormValid = false; 
            }

            
            // Khi form không có lỗi nào thì nó sẽ đc submit
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){ // submit with JavaScript

                    // Lay All tag has name
                    var enableInputs = formElement.querySelectorAll('[name]');

                    // Lay value cho moi input
                    var formValues = Array.from(enableInputs).reduce(function(values,input) {
                        switch(input.type){
                            case 'radio':
                                // chi lay checked
                                if(input.matches(':checked'))
                                    values[input.name] = input.value;
                                break;
                            case 'checkbox':
                                if(!Array.isArray(values[input.name])) values[input.name] = [];
                                if(input.matches(':checked'))
                                    values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    },{})
                    options.onSubmit(formValues);
                        
                }
                else{ // submit hành vi mặc định
                    formElement.submit();
                }
            }
        }// onsubmit    

        // lặp qua từng rules lấy ra thẻ Input
       options.rules.forEach(function(rule){
            // Lưu lại các rule cho mỗi Input, nếu chưa có thì thêm vào mảng, là mảng thì push vào
            if(Array.isArray(rulesSelector[rule.selector])){
                rulesSelector[rule.selector].push(rule.test);
            }else{
                rulesSelector[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            
            for(var i = 0; i < inputElements.length; i++){
                var inputElement = inputElements[i];
                 // Bắt sự kiện thẻ Input
                if(inputElement){
                    inputElement.onblur = function(){
                        validate(inputElement,rule);
                    }
                    inputElement.onchange = function(){
                        validate(inputElement,rule);
                    }
                    inputElement.oninput = function(){
                        var errorElement = inputElement.closest(options.formGroup).querySelector(options.errorSelector);
                        errorElement.innerText = '';
                        inputElement.closest(options.formGroup).classList.remove('invalid');
                    }
                }
            }
           
       });
       
    }
    
}









// Dinh nghia cho các rule --> Trả về message lỗi và nhận vào selector
Validator.isRequired = function(selector,message){
    return {
        selector,
        // rong cham trim() duoc nhung null thi khong //
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này!'
        }
    };
}


Validator.isEmail = function(selector,message){
    return {
        selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email!'
        }
    };
}


Validator.isPassWord = function(selector,min,message){
    return {
        selector,
        test: function(value){
           return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự!`
        }
    };
}

Validator.isConfirmed = function(selector,getValueCofirm,message){
    return {
        selector,
        test: function(value){
           return value === getValueCofirm() ? undefined : message || 'Giá trị nhập vào không chính xác!'
        }
    };
}
Validator.isPhone = function(selector,min,message){
    return {
        selector,
        test: function(value){
           return value.match(/^\d/g) && value.length >= min ? undefined : message || `Số điện thoại phải là số và ít nhất ${min} kí tự!`
        }
    };
}
Validator.isNumber = function(selector,message){
    return {
        selector,
        test: function(value){
           return value.match(/^\d+$/) ? undefined : message || `Trường này phải là số`
        }
    };
}