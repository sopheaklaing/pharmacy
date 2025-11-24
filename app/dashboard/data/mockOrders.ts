// app/data/mockOrders.ts
import type { Order } from "./../models/ItemModel";

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    customerEmail: "john.doe@example.com",
    item_name: "Wireless Headphones",
    total: "$149.99",
    status: "completed",
    date: "2024-01-15",
    items: 1
  },
  {
    id: "ORD-2024-002",
    customer: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    item_name: "Smart Watch + Accessories",
    total: "$299.50",
    status: "processing",
    date: "2024-01-15",
    items: 2
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Johnson",
    customerEmail: "mike.johnson@example.com",
    item_name: "Laptop Bag",
    total: "$89.99",
    status: "pending",
    date: "2024-01-14",
    items: 1
  },
  {
    id: "ORD-2024-004",
    customer: "Sarah Wilson",
    customerEmail: "sarah.wilson@example.com",
    item_name: "Phone Case",
    total: "$24.99",
    status: "completed",
    date: "2024-01-14",
    items: 1
  },
  {
    id: "ORD-2024-005",
    customer: "David Brown",
    customerEmail: "david.brown@example.com",
    item_name: "Tablet + Stylus",
    total: "$450.00",
    status: "cancelled",
    date: "2024-01-13",
    items: 2
  },
  {
    id: "ORD-2024-006",
    customer: "Emily Davis",
    customerEmail: "emily.davis@example.com",
    item_name: "Wireless Earbuds",
    total: "$129.99",
    status: "completed",
    date: "2024-01-13",
    items: 1
  }
];
