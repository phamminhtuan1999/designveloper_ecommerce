# Ecommerce Mini Project Requirements

## 1. Introduction

### 1.1. Purpose

This document describes the business needs and technical requirements for developing an e-commerce web app.

### 1.2. Proposal

We run a business selling clothes. We want to create a merchandising web app to expand our market online. The app is an MVP and must be completed within three weeks to test the market. We aim to utilize modern technologies such as **Node.js, ES6, and React**.

## 2. Technical Details

The app consists of two parts:

- A **website**: A simple e-commerce platform listing clothing items.
- An **API server**: Handles requests from the seller, such as adding or removing listings.

### Requirements:

- The API server must be developed using **TDD (Test-Driven Development)** and achieve **100% unit test coverage**.
- The project must follow the **Gitflow** workflow.
- **ES6** must be used in the code.

### Tech Stack:

- **Database**: MySQL
- **Backend**: Node.js, Express
- **Frontend**: React
- **Frontend Development**: Fully custom-coded without UI libraries, must be responsive.
- **Backend Development**: Use raw SQL queries to retrieve data, without using an ORM.
- **Deployment**: Must be deployed on any cloud provider or free hosting service.
- **Version Control**: Regular commits to a Git repository are required.

## 3. User Roles

### 3.1. Customer

- Log in
- Log out
- Sign up
- Browse clothes
- Order clothes
- Cancel order

### 3.2. Seller

- **Only 1 seller (pre-created, acts as an admin)**
- Log in
- Log out
- Add clothes
- Remove clothes
- Edit clothes details
- Complete orders

## 4. User Stories

### 4.1. Mandatory

| ID  | As a(n)  | I want                                           | Criteria                                                                       |
| --- | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| 1   | Customer | To sign up with email                            | -                                                                              |
| 2   | User     | To log in with email                             | -                                                                              |
| 3   | User     | To log out                                       | -                                                                              |
| 4   | Customer | To browse clothes                                | - Display 20 listings per page <br> - Pagination must be handled on the server |
| 5   | Customer | To see what sizes are available                  | - Sizes: **S, M, L** <br> - Each size has a different stock count              |
| 6   | Customer | To see the number of items in stock of a listing | -                                                                              |
| 7   | Customer | To add to cart                                   | -                                                                              |
| 8   | Customer | To remove items from my cart                     | -                                                                              |
| 9   | Customer | To place an order                                | - Ordered items must reduce stock count                                        |
| 10  | Customer | To receive a confirmation email after ordering   | -                                                                              |
| 11  | Customer | To cancel my order                               | -                                                                              |
| 12  | Seller   | To add a new listing                             | -                                                                              |
| 13  | Seller   | To remove a listing                              | -                                                                              |
| 14  | Seller   | To update stock count of a listing               | -                                                                              |
| 15  | Seller   | To receive an email when an order is placed      | -                                                                              |
| 16  | Seller   | To receive an email when an order is cancelled   | -                                                                              |
| 17  | Seller   | To view pending orders                           | -                                                                              |
| 18  | Seller   | To mark pending orders as completed              | -                                                                              |

### 4.2. Optional (Nice to have)

| ID  | As a(n)  | I want                                                     | Criteria                                                                               |
| --- | -------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 19  | User     | To change my password                                      | -                                                                                      |
| 20  | Customer | To filter by size                                          | - Filtering must be handled on the server                                              |
| 21  | Customer | To filter by availability (not out of stock)               | - Filtering must be handled on the server                                              |
| 22  | Seller   | To tag a listing with a category when adding a new listing | -                                                                                      |
| 23  | Seller   | To update the category of an existing listing              | -                                                                                      |
| 24  | Customer | To filter by category                                      | - Filtering must be handled on the server                                              |
| 25  | Customer | To rate a purchased listing                                | - Must have purchased and completed order <br> - Use standard **5-star rating system** |

## 5. Constraints

- All pages must load within **2 seconds**.
- There must be **no errors** in the browser console (unless from third-party libraries).
- **All critical interactions** (e.g., deleting listings, confirming orders) must have a **confirmation popup** (e.g., "Are you sure?").
