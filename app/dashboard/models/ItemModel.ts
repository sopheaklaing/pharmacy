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





// new for update items to pamacy
// ==================================================================
// FILE: app/models/MedicationModel.ts
// DESCRIPTION: TypeScript interfaces and types for the pharmacy system
// ==================================================================

export interface Medication {
  id: number;
  img: string;
  name: string;
  generic_name?: string;
  description: string;
  category: string;
  dosage_form?: string;
  strength?: string;
  manufacturer?: string;
  stock_quantity: number;
  reorder_level: number;
  unit_price: number;
  expiry_date?: string;
  batch_number?: string;
  prescription_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewMedication {
  img: string | File;
  name: string;
  generic_name?: string;
  description: string;
  category: string;
  dosage_form?: string;
  strength?: string;
  manufacturer?: string;
  stock_quantity: number;
  reorder_level: number;
  unit_price: number;
  expiry_date?: string;
  batch_number?: string;
  prescription_required: boolean;
}

export interface MedicationModalProps {
  isOpen: boolean;
  editingMedication: Medication | null;
  newMedication: NewMedication;
  setNewMedication: React.Dispatch<React.SetStateAction<NewMedication>>;
  onClose: () => void;
  onSubmit: () => void;
  categories: string[];
  refreshCategories: () => void;
}

export interface StockLog {
  id: number;
  medication_id: number;
  quantity: number;
  transaction_type: 'in' | 'out';
  reason?: string;
  batch_number?: string;
  expiry_date?: string;
  created_at: string;
  medications?: {
    name: string;
    strength?: string;
    dosage_form?: string;
  };
}