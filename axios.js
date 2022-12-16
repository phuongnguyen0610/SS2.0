const axios = require('axios');
const username = 'ClientID';
const password = 'Client Secret';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const header = {
    'Authorization': `Basic ${token}`
};
const baseURL = 'https://api-jb2.integrations.ecimanufacturing.com:443';
const data = {
    "active": false,
    "billingAddress1": "string",
    "billingCity": "string",
    "billingCountry": "string",
    "billingState": "string",
    "billingZIPCode": "string",
    "comments1": "string",
    "comments2": "string",
    "creditLimit": 0,
    "creditStatus": "string",
    "currencyCode": "string",
    "customerCode": "string",
    "customerName": "string",
    "defaultPriority": 0,
    "discountPercent": 0,
    "fax": "string",
    "federalIDNumber": "string",
    "GSTCode": "string",
    "minimumOrder": 0,
    "phone": "string",
    "QBCustomerCode": "string",
    "salesID": "string",
    "taxCode": "string",
    "termsCode": "string",
    "user_Currency1": 0,
    "user_Currency2": 0,
    "user_Date1": "2022-12-14T18:09:25.0000000+00:00",
    "user_Date2": "2022-12-14T18:09:25.0000000+00:00",
    "user_Memo1": "string",
    "user_Number1": 0,
    "user_Number2": 0,
    "user_Number3": 0,
    "user_Number4": 0,
    "user_Text1": "string",
    "user_Text2": "string",
    "user_Text3": "string",
    "user_Text4": "string",
    "website": "string",
    "workCode": "string",
    "shippingAddresses": [
      {
        "location": "string",
        "printCertification": false,
        "shippingAddress1": "string",
        "shippingCity": "string",
        "shippingCode": "string",
        "shippingContact": "string",
        "shippingCountry": "string",
        "shippingFAX": "string",
        "shippingPhone": "string",
        "shippingState": "string",
        "shippingZipCode": "string",
        "shipToName": "string",
        "shipVia": "string",
        "territory": "string"
      }
    ]
};
//https://api-jb2.integrations.ecimanufacturing.com:443/api/v1/orders?fields=orderNumber%2C%20orderTotal&take=20
//https://api-jb2.integrations.ecimanufacturing.com:443/api/v1/employees?fields=employeeCode%2C%20employeeName%2C%20employeeShortName%2C%20phone%2C%20rate1%2C%20shiftID%2C%20state%2C%20uniqueID&take=20
axios.get(baseURL+ '/api/v1/customers?fields=customerName&take=10', header)
    .then(function (response){
        console.log('response: ',response);
    })
    .catch(function (error){
        console.log('error: ', error);
    })
    .then(function(){

    });
//Post
axios.post(baseURL+ '/api/v1/customers', data, header)
.then(function (response) {
    console.log('post response: ', response);
  })
  .catch(function (error) {
    console.log('post error: ',error);
  });

