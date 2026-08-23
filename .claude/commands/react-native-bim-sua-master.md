# Role

You are a Senior React Native Engineer, Software Architect, and Business Analyst.

Build a production-ready mobile application for managing a baby diaper and milk retail store.

The application is an internal business management application, not an e-commerce application for consumers.

You must analyze the business requirements first, design the system architecture and database properly, and then implement the application incrementally.

---

# Mandatory Agent Skills

Before implementing any feature, inspect and use the relevant skills available under:

```text
.agents/skills/
```

Especially use:

```text
project-react-native
react-native-core
react-native-best-practices
upgrade-react-native
migrate-to-strict-api
```

Follow `project-react-native` as the primary project architecture and coding convention.

Use `react-native-best-practices` whenever dealing with:

- FlatList / large lists
- rendering performance
- React re-renders
- memory
- images
- application startup
- navigation performance
- animations
- bundle size

Do not ignore project skills.

Before implementing a feature, inspect the relevant `SKILL.md` and references.

---

# Backend Requirement

Use the connected **Supabase MCP Server** as the backend and database management tool.

Do NOT manually assume the Supabase database state.

Use Supabase MCP to:

1. Inspect the current Supabase project.
2. Inspect existing tables, schemas, policies and storage buckets.
3. Create or modify database tables.
4. Create migrations when appropriate.
5. Create indexes.
6. Configure relationships.
7. Configure Row Level Security.
8. Configure Supabase Storage.
9. Verify database changes after creating them.

Supabase will provide:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security
- backend APIs

Do not create a separate backend server unless there is a strong technical requirement.

---

# Technology Stack

Use:

```text
React Native
Expo
TypeScript
Expo Router
Supabase
TanStack Query
Zustand
React Hook Form
Zod
```

Use strict TypeScript.

Avoid `any`.

Do not introduce another state-management, form, validation, navigation or backend library unless absolutely necessary.

---

# Application Purpose

Build a mobile management application for a store selling:

- diapers
- baby formula / milk
- baby products
- mother and baby products
- related retail products

The application should allow the store owner/staff to manage:

1. Product categories
2. Products
3. Goods imports
4. Inventory
5. Orders
6. Customers
7. Suppliers
8. Product origin
9. Purchase invoices / VAT invoices
10. Product images
11. Revenue reports
12. Profit reports
13. Inventory reports
14. Expiration-date reports
15. PDF order export

---

# UX Direction

The application is primarily for store owners and employees.

Optimize UX for:

- fast data entry
- fast product search
- quick order creation
- readable inventory information
- clear warnings
- simple business dashboards

Avoid unnecessary decorative UI.

The UI should feel like a modern business management application.

Support both Android and iOS.

---

# Authentication

Use Supabase Authentication.

Initially support:

```text
email + password
```

Prepare architecture for roles:

```text
owner
staff
```

Owner can access all features.

Staff permissions should be extendable later.

Do not over-engineer permissions in the first iteration, but design the data model so role-based authorization can be added cleanly.

---

# MODULE 1 — Dashboard

Create a dashboard showing business overview.

Display:

- revenue today
- revenue this month
- estimated profit this month
- number of orders today
- number of products
- total inventory quantity
- products with low stock
- products approaching expiration
- recently created orders

Provide shortcuts:

```text
Create Order
Add Product
Import Goods
Customers
Inventory
Reports
```

Dashboard queries should be optimized.

Avoid downloading the entire database to calculate statistics on the client.

Use PostgreSQL queries/views/RPC where appropriate.

---

# MODULE 2 — Product Categories

Allow users to:

- create category
- edit category
- delete category
- list categories
- search category

Category fields:

```text
id
name
description
created_at
updated_at
```

Example categories:

```text
Diapers
Formula Milk
Baby Food
Baby Care
Mother Care
Accessories
```

Prevent deleting categories that are still used by products unless safely handled.

---

# MODULE 3 — Products

Allow users to:

- create product
- view product
- update product
- delete/archive product
- search product
- filter products
- view inventory
- view import history
- view sales history

Product fields should include at least:

```text
id
sku
barcode
name
category_id
brand
unit
description
selling_price
default_purchase_price
minimum_stock
status
created_at
updated_at
```

Possible units:

```text
box
can
pack
bag
piece
bottle
```

Do not store current inventory as an unreliable manually editable number if it can be calculated from stock transactions.

Design inventory properly.

---

# MODULE 4 — Product Images

A product can have multiple images.

Images can include:

- front image
- back image
- barcode
- ingredient information
- secondary label
- packaging
- other product images

Use Supabase Storage.

Suggested structure:

```text
product-images/{product_id}/{file}
```

Create a proper storage bucket and access policies.

Product images should support:

- upload
- preview
- delete
- multiple images
- primary image

Optimize images for React Native rendering.

---

# MODULE 5 — Product Origin

Store information related to product origin.

Fields may include:

```text
origin_country
manufacturer
supplier_id
distributor
source_description
notes
```

For inventory batches/imports also support:

```text
lot_number
manufacture_date
expiration_date
```

Origin information should be traceable.

For example:

```text
Product
→ Supplier
→ Import Receipt
→ Batch
→ Expiration
```

---

# MODULE 6 — Suppliers

Create supplier management.

Supplier fields:

```text
id
name
phone
email
address
tax_code
contact_person
notes
created_at
updated_at
```

Features:

- create
- edit
- view
- archive
- search
- view import history

---

# MODULE 7 — Goods Import / Purchase Receipt

This is an important module.

The user must be able to record products imported into the store.

An import receipt should contain:

```text
receipt_number
supplier
import_date
total_cost
notes
```

Each receipt contains multiple items.

Example:

```text
Import Receipt
 ├── Product A
 │   quantity: 20
 │   purchase_price: 280000
 │   lot: A001
 │   expiration: 2027-03-20
 │
 └── Product B
     quantity: 10
     purchase_price: 420000
     lot: B002
     expiration: 2027-06-01
```

Each import item should support:

```text
product_id
quantity
purchase_price
lot_number
manufacture_date
expiration_date
```

When an import receipt is confirmed:

```text
Inventory +
```

Inventory changes must be traceable.

Do not simply update inventory without creating transaction history.

---

# MODULE 8 — VAT / Purchase Invoice Storage

When importing goods, users need to save the purchase invoice / VAT invoice ("hóa đơn đỏ").

Support:

- invoice number
- invoice date
- supplier
- tax code
- notes
- invoice files/images
- PDF invoice
- image invoice

Store files using Supabase Storage.

Suggested bucket:

```text
purchase-invoices
```

Suggested path:

```text
purchase-invoices/{import_receipt_id}/{file}
```

One import receipt may contain zero or multiple invoice files.

---

# MODULE 9 — Inventory

Create a proper inventory management model.

Inventory changes can originate from:

```text
IMPORT
SALE
ORDER_CANCEL
MANUAL_ADJUSTMENT
RETURN
DAMAGE
EXPIRED
```

Create an inventory transaction / stock movement table.

Example:

```text
inventory_transactions

id
product_id
batch_id
type
quantity
reference_type
reference_id
note
created_at
created_by
```

Quantity can follow a clear signed convention or separate direction fields.

The architecture must ensure inventory can be audited.

Inventory screen should show:

```text
product
SKU
current stock
minimum stock
stock status
nearest expiration date
```

Filters:

```text
all
low stock
out of stock
near expiration
expired
```

---

# MODULE 10 — Batch Inventory

Because milk and baby products have expiration dates, inventory must support batches.

Suggested entity:

```text
product_batches

id
product_id
import_item_id
lot_number
manufacture_date
expiration_date
purchase_price
initial_quantity
remaining_quantity
created_at
```

Think carefully about whether `remaining_quantity` should be persisted or derived.

Choose an approach that preserves transaction integrity.

When selling a product with several batches, prefer:

```text
FEFO
First Expired First Out
```

unless the user manually selects another batch.

Explain the chosen inventory strategy before implementation.

---

# MODULE 11 — Orders

Allow:

```text
Create Order
View Order
Edit Order
Cancel/Delete Order
Search Order
Filter Order
```

Order information:

```text
order_number
customer
order_date
status
subtotal
discount
total
note
payment_method
payment_status
```

Order items:

```text
product
quantity
unit_price
discount
line_total
```

Statuses:

```text
draft
confirmed
completed
cancelled
```

Suggested payment methods:

```text
cash
bank_transfer
other
```

Suggested payment statuses:

```text
unpaid
partial
paid
```

When an order is completed:

```text
Inventory -
```

When a completed order is cancelled:

```text
Inventory rollback +
```

Make this operation safe and transactional.

Prevent selling quantities greater than available inventory unless explicitly allowed by business configuration.

---

# MODULE 12 — Create Order UX

The order creation screen should be optimized for fast store usage.

Support:

- search by product name
- search by SKU
- barcode search if possible
- recently used products
- add/remove product
- change quantity
- change selling price if authorized
- discount
- select customer
- create customer quickly
- payment method
- order note

Show:

```text
subtotal
discount
total
```

Clearly show inventory availability.

---

# MODULE 13 — Order PDF Export

Users must be able to export an order as PDF.

PDF should contain:

```text
Store name
Order number
Order date
Customer
Phone
Products
Quantity
Unit price
Line total
Discount
Grand total
Payment method
Notes
```

Support:

```text
Generate PDF
Preview PDF
Share PDF
Save PDF
```

Use an Expo-compatible PDF solution.

Keep PDF generation separated from screen components.

Create something similar to:

```text
services/pdf/
  order-pdf.service.ts
```

Ensure Vietnamese text renders correctly.

---

# MODULE 14 — Customers

Customer fields:

```text
id
name
phone
email
address
notes
created_at
updated_at
```

Features:

- create
- edit
- view
- archive/delete
- search
- order history
- total purchases
- last purchase date

Phone should be a major search key.

---

# MODULE 15 — Revenue Reports

Provide revenue statistics.

Support:

```text
today
this week
this month
custom date range
```

Metrics:

```text
total revenue
total orders
average order value
```

Charts may be added where appropriate.

Do not fetch all orders and calculate large reports entirely on the device.

Use SQL views/functions/RPC queries where appropriate.

---

# MODULE 16 — Profit Reports

Calculate estimated profit.

Basic calculation:

```text
profit =
sales revenue
-
cost of goods sold
```

Do not calculate profit from `default_purchase_price`.

Use the actual batch/import purchase cost associated with sold inventory.

Support:

```text
profit by month
profit by product
profit by category
```

Display:

```text
revenue
cost
profit
profit margin
```

Design the inventory/order schema so historical profit remains correct even if product prices later change.

---

# MODULE 17 — Inventory Reports

Reports should include:

```text
current inventory
inventory value
low stock
out of stock
stock by category
stock by product
```

Inventory valuation should use a clearly documented method.

If FEFO batch costing is used for sales, preserve actual historical cost.

---

# MODULE 18 — Expiration Reports

This is a critical business feature.

Show products:

```text
expired
expires within 7 days
expires within 30 days
expires within 60 days
expires within 90 days
```

Display:

```text
product
batch
expiration date
remaining quantity
supplier
import receipt
days remaining
```

Sort by nearest expiration date.

Use a visual warning hierarchy.

---

# Database Design

Before writing React Native screens, design the Supabase/PostgreSQL schema.

At minimum evaluate these entities:

```text
profiles

categories
products
product_images

suppliers

import_receipts
import_receipt_items
purchase_invoice_files

product_batches
inventory_transactions

customers

orders
order_items
order_item_batches
```

Do NOT blindly create this schema.

First analyze:

- relationships
- normalization
- auditability
- inventory consistency
- FEFO
- historical pricing
- profit calculation
- order cancellation
- batch expiration
- supplier traceability

Then provide the final proposed ERD.

---

# Database Requirements

Use:

```text
UUID primary keys
created_at
updated_at
foreign keys
constraints
indexes
```

Add indexes for common searches such as:

```text
products.name
products.sku
products.barcode
customers.phone
orders.order_number
orders.created_at
product_batches.expiration_date
```

Use PostgreSQL features where appropriate.

Do not prematurely add unnecessary complexity.

---

# Transaction Safety

Critical operations must be transactional.

Especially:

```text
Confirm import
Complete order
Cancel completed order
Inventory adjustment
```

If needed, implement PostgreSQL functions / Supabase RPCs.

Example:

```text
complete_order(order_id)
```

should atomically:

```text
validate stock
allocate batches using FEFO
create order batch allocations
create inventory transactions
update order status
```

If any step fails:

```text
rollback everything
```

Do not perform these critical operations as multiple unsafe independent client requests.

---

# Supabase RLS

Enable Row Level Security.

At minimum design policies around authenticated users.

Do not leave production business tables publicly writable.

Use:

```text
auth.uid()
```

and profiles/roles where appropriate.

Storage buckets must also have appropriate policies.

---

# React Native Architecture

Follow feature-based architecture.

Suggested structure:

```text
app/
├── _layout.tsx
├── (auth)/
├── (tabs)/
└── ...

src/
├── components/
│   ├── ui/
│   └── common/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── categories/
│   ├── suppliers/
│   ├── imports/
│   ├── inventory/
│   ├── orders/
│   ├── customers/
│   └── reports/
│
├── services/
│   ├── supabase/
│   └── pdf/
│
├── hooks/
├── stores/
├── constants/
├── types/
└── utils/
```

Do not create giant screens.

Separate:

```text
UI
business logic
data fetching
validation
database types
```

---

# TanStack Query

Use TanStack Query for server state.

Create query-key factories when useful.

Example:

```text
products.all
products.list(filters)
products.detail(id)

orders.all
orders.list(filters)
orders.detail(id)
```

Handle:

```text
loading
error
empty
refetch
pagination
mutation
cache invalidation
```

Do not put Supabase server data into Zustand unnecessarily.

---

# Zustand

Use Zustand only for client state that needs to survive across components/screens.

Possible examples:

```text
current draft order
temporary order cart
application preferences
```

Do not duplicate TanStack Query server data.

---

# Forms

Use:

```text
React Hook Form
Zod
```

Create schemas for forms such as:

```text
productSchema
customerSchema
supplierSchema
importReceiptSchema
orderSchema
```

Show user-friendly Vietnamese validation messages.

---

# Language

The initial UI should use Vietnamese.

Examples:

```text
Tổng quan
Sản phẩm
Danh mục
Nhập hàng
Kho hàng
Đơn hàng
Khách hàng
Nhà cung cấp
Báo cáo
```

Keep code identifiers in English.

Example:

```ts
getProducts();
createOrder();
importReceipt;
inventoryTransaction;
```

Do not use Vietnamese identifiers in source code.

---

# Error Handling

Create consistent error handling.

Do not expose raw Supabase/PostgreSQL errors directly to users.

Convert errors into useful Vietnamese messages.

Example:

```text
Không đủ tồn kho để hoàn thành đơn hàng.
```

instead of raw database exceptions.

---

# Loading / Empty / Error States

Every list screen must handle:

```text
loading
refreshing
empty
error
success
```

Do not implement only the happy path.

---

# Search and Pagination

Large screens such as:

```text
products
orders
customers
inventory
imports
```

should support scalable querying.

Avoid downloading all records.

Use:

```text
pagination
server-side filtering
server-side sorting
debounced search
```

---

# Deletion Strategy

Do not automatically hard-delete important business records.

Evaluate using:

```text
archived_at
is_active
status
```

for:

```text
products
customers
suppliers
```

Financial/inventory history should remain auditable.

Orders/import receipts that affect inventory should normally be cancelled/reversed rather than physically deleted.

---

# Auditability

The system must allow users to understand:

```text
Why is current stock 25?
Where did this batch come from?
Which supplier provided it?
Which import receipt created it?
When does it expire?
Which order sold it?
What was its actual purchase cost?
```

Design database relationships accordingly.

---

# Implementation Strategy

Do NOT implement the entire app blindly in one pass.

Work in phases.

## Phase 0 — Inspect

Before editing:

1. Inspect the existing repository.
2. Inspect package.json.
3. Inspect Expo configuration.
4. Inspect TypeScript config.
5. Inspect existing project structure.
6. Inspect `.agents/skills`.
7. Inspect existing Supabase integration.
8. Use Supabase MCP to inspect the backend project.

Do not duplicate existing infrastructure.

---

## Phase 1 — Architecture & Database

Before creating screens:

1. Analyze requirements.
2. Propose architecture.
3. Create ERD.
4. Define tables.
5. Define relationships.
6. Define indexes.
7. Define RLS.
8. Define Storage buckets.
9. Define critical PostgreSQL RPCs.
10. Explain FEFO inventory strategy.

Then implement the Supabase schema using MCP.

Verify all created objects afterward.

---

## Phase 2 — App Foundation

Implement:

```text
Supabase client
TanStack Query provider
Expo Router
authentication
app layout
shared UI components
error handling
theme foundations
```

---

## Phase 3 — Master Data

Implement:

```text
Categories
Products
Product images
Suppliers
Customers
```

---

## Phase 4 — Goods Import

Implement:

```text
Import receipts
Import items
Product batches
VAT invoice upload
Inventory increase
```

---

## Phase 5 — Inventory

Implement:

```text
Inventory overview
Stock transactions
Batch detail
Low stock
Expiration warnings
```

---

## Phase 6 — Orders

Implement:

```text
Order creation
Product selection
Customer selection
Draft order
Complete order
FEFO allocation
Inventory deduction
Order cancellation
```

---

## Phase 7 — PDF

Implement:

```text
Order PDF generation
Preview
Share
Save
```

---

## Phase 8 — Dashboard & Reports

Implement:

```text
Dashboard
Revenue
Profit
Inventory
Expiration
Product reports
```

---

## Phase 9 — Quality

Run:

```text
TypeScript check
ESLint
tests
Expo validation
```

Review using:

```text
project-react-native
react-native-best-practices
```

Fix discovered issues.

---

# Testing

Create tests for important business logic.

Prioritize:

```text
inventory calculations
FEFO allocation
order totals
discount calculation
profit calculation
expiration logic
validation
```

Critical PostgreSQL functions should also be tested or verified using Supabase queries.

---

# Do Not Do

Do NOT:

- use `any` unnecessarily
- put Supabase calls directly inside large UI components
- duplicate API/server state into Zustand
- use ScrollView + map for large datasets
- hardcode database IDs
- store secrets in EXPO_PUBLIC variables
- expose service-role keys in React Native
- bypass RLS using service-role credentials
- calculate large reports entirely on the mobile client
- silently swallow errors
- implement inventory as only `products.stock = stock + x`
- overwrite historical prices
- hard-delete financial/inventory history
- create multiple competing abstractions for the same concern

---

# Working Style

For every phase:

1. Briefly state what you discovered.
2. State what you are going to change.
3. Apply the changes.
4. Verify them.
5. Fix errors.
6. Summarize completed work.
7. State the next logical phase.

Do not ask unnecessary questions when a reasonable production-grade assumption can be made.

If an important business decision is ambiguous:

- choose a sensible default
- document the assumption
- design it so it can be changed later

---

# Initial Task

Start with **Phase 0 and Phase 1 only**.

Do NOT build application screens yet.

Your first task is:

1. Inspect the repository.
2. Read relevant React Native skills.
3. Inspect the Supabase project using MCP.
4. Analyze the business requirements.
5. Propose the architecture.
6. Design the database ERD.
7. Design inventory + batch + FEFO strategy.
8. Design order/inventory transaction flow.
9. Design RLS.
10. Design Storage buckets.
11. Identify required PostgreSQL RPC functions.
12. Present the proposed implementation plan.
13. Then create the approved database foundation using Supabase MCP if no existing schema conflicts with the design.
14. Verify the resulting Supabase schema.

Do not start UI feature implementation until the database foundation and architecture are coherent.
