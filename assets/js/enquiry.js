
const checkEmpty = (field) => (!!((field !== undefined && field !== null && field !== '')));

$(document).ready(function(){
    $("#enquiryForm").on("submit", function(event){
  
        event.preventDefault();
        const mobileValidate = (field) => ( field.length !== 10 || field/field !== 1)? false : true;
        const emailRegex1 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const validateErrors = [];
        const fullName = $('#name').val();
        const email = $('#email').val();
        const mobile = $('#mobile').val();
        const message = $('#message').val();
        if(!checkEmpty(fullName)){ validateErrors.push('Required Name Field...')  };
        if(!checkEmpty(mobile) || !mobileValidate(mobile)){ validateErrors.push('Required Valid Mobile...')  };
        if(checkEmpty(email)){
            if(!emailRegex1.test(email)){ validateErrors.push('Required Valid Email...');  };
        }
        if(validateErrors.length > 0){
            const errors = [];
            validateErrors.forEach((item)=>{errors.push(`<span style="color:red">${item}</span></br>`); })
            $('#enquiryFormErrors').html(errors);
        }else{

             var emailData = {};
            emailData.fullName = fullName;
            emailData.email =  email;
            emailData.mobile =  mobile;
            emailData.message = message;
            emailData.body = `<p>Customer Name : ${emailData.fullName}</p></br><p>Mobile : ${emailData.mobile}</p></br>
            <p>Email : ${emailData.email}</p></br><p>Message : ${emailData.message}</p></br>`;
            emailData.subject = "New Enquiry From Web-Portal";
                Email.send({
                  Host: "smtp.gmail.com",
                  Username: "khshivraj1234@gmail.com",
                  Password: "shivaraj@pas",
                  To: 'lokey2094@gmail.com,ashokroyal66@gmail.com',
                  From: 'New Enquiry <khshivraj1234@gmail.com>',
                  Subject: emailData.subject,
                  Body: emailData.body,
                });
            $('#enquiryForm').html(`<span style="color:green"><h3>Thank You</h3></br> Our team will contact you soon.</span></br>`);
            $('#name').val(''); $('#email').val(''); $('#mobile').val(''); $('#message').val('');
        }



    })
    });


//enquiryFormErrors