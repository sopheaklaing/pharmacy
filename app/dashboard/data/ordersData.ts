// app/data/ordersData.ts
export interface Order {
  id: number;
  customer: string;
  total: string;
  status: string;
}

// 
// Simple in-memory orders array (for demo)
const orders: any[] = [
  { id: 1, customer: "John Doe", total: "$120", status: "Completed", item_name: "Laptop", date: "2025-11-18" },
  { id: 2, customer: "Jane Smith", total: "$80", status: "Pending", item_name: "Mouse", date: "2025-11-18" },
];

export default orders;

