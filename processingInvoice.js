/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
//processes invoices and contains logic to handle errors
//Find the customers associated with all open invoices
//Apply a location-based discount to each invoice
//Write each invoice to the reduce stage so it is grouped by customer
//Initialize a new CustomerPayment for each customer applied only to the invoices specified in the reduce values
//Create a custom record capturing the details of the records that were processed
//Notify administrators of any exceptions using an email notification
//Prior to running this sample, you need to manually create a custom record type with id "customrecord_summary"
//and text fields with id "custrecord_time", "custrecord_usage", and "custrecord_yields". 
define(['N/Search', 'N/record', 'N/email', 'N/runtime', 'N/error'],
    function (search, record, email, runtime, error){

    }    
);