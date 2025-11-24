// app/models/ItemModel.ts

export interface Item {
  id: number;
  img: string;
  nameproduce: string;
  description: string;
  category: string;
}

// NEW model that accepts image FILE or URL string
export interface NewItem {
  img: string | File;
  nameproduce: string;
  description: string;
  category: string;
}

// Props for ItemModal component
export interface ItemModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  newItem: NewItem;
  setNewItem: React.Dispatch<React.SetStateAction<NewItem>>;
  onClose: () => void;
  onSubmit: () => void;
  categories: string[];
  refreshCategories: () => void;
}


export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  processedAt: string | null;
}
export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  item_name: string;
  total: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  items: number;
}
export interface Item {
  id: number;
  img: string;
  nameproduce: string;
  description: string;
  category: string;
}