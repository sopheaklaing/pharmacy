import { NextResponse } from "next/server";
import orders from "../../data/ordersData";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // allow all origins for dev
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight request
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newOrder = {
      id: orders.length + 1,
      customer: `User ${data.user_id}`,
      total: `$${data.amount}`,
      status: "Pending",
      item_name: data.item_name,
      date: data.date,
    };

    orders.push(newOrder);

    return new NextResponse(JSON.stringify({ message: "Order added", order: newOrder }), { headers: corsHeaders });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  return new NextResponse(JSON.stringify(orders), { headers: corsHeaders });
}
