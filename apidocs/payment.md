# Payment Service

This service provides APIs for managing payments in the Republic School Student system.

## Features

- Get payment history for an application

## API Endpoints

### Get Payment History

- **Endpoint**: `GET /payment/get-payment-history/:application_id`
- **Description**: Retrieves payment history for an application
- **URL Parameters**:
  - `application_id` (string): The ID of the application to retrieve payment history for
- **Response**:
  ```json
  {
    "admissionPayments": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "application_id": "60c72b2f9b1d8c001f8e4a3c",
        "order_id": "60c72b2f9b1d8c001f8e4a3d",
        "auth_id": "auth123",
        "authorization": "auth456",
        "bank_reference": "bank123",
        "cf_payment_id": "cf123",
        "entity": "payment",
        "error_details": null,
        "is_captured": true,
        "order_amount": 1000,
        "payment_amount": 1000,
        "payment_completion_time": "2023-06-22T10:00:00.000Z",
        "payment_currency": "INR",
        "payment_gateway_details": {
          "gateway_name": "razorpay",
          "gateway_order_id": "order123",
          "gateway_payment_id": "pay123",
          "gateway_order_reference_id": "ref123",
          "gateway_status_code": "200",
          "gateway_settlement": "settled"
        },
        "payment_group": "admission",
        "payment_message": "Payment successful",
        "payment_method": {
          "upi": {
            "channel": "gpay",
            "upi_id": "user@okbank"
          }
        },
        "payment_offers": null,
        "payment_status": "SUCCESS",
        "payment_time": "2023-06-22T09:55:00.000Z",
        "createdAt": "2023-06-22T09:55:00.000Z",
        "updatedAt": "2023-06-22T10:00:00.000Z"
      }
    ],
    "courseFees": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "application_id": "60c72b2f9b1d8c001f8e4a3c",
        "order_id": "order456",
        "auth_id": "auth789",
        "authorization": "auth101112",
        "bank_reference": "bank456",
        "cf_payment_id": "cf456",
        "entity": "payment",
        "error_details": null,
        "is_captured": true,
        "order_amount": 5000,
        "payment_amount": 5000,
        "payment_completion_time": "2023-06-23T10:00:00.000Z",
        "payment_currency": "INR",
        "payment_gateway_details": {
          "gateway_name": "razorpay",
          "gateway_order_id": "order456",
          "gateway_payment_id": "pay456",
          "gateway_order_reference_id": "ref456",
          "gateway_status_code": "200",
          "gateway_settlement": "settled"
        },
        "payment_group": "course_fee",
        "payment_message": "Payment successful",
        "payment_method": {
          "upi": {
            "channel": "phonepe",
            "upi_id": "user@okbank"
          }
        },
        "payment_offers": null,
        "payment_status": "SUCCESS",
        "payment_time": "2023-06-23T09:55:00.000Z",
        "createdAt": "2023-06-23T09:55:00.000Z",
        "updatedAt": "2023-06-23T10:00:00.000Z"
      }
    ]
  }
  ```

## Notes

- The `admissionPayments` array contains payment records for admission fees
- The `courseFees` array contains payment records for course fees
- Both types of payment records have similar structures but are stored in different collections
- Payment status can be one of: 'PENDING', 'SUCCESS', 'FAILED'