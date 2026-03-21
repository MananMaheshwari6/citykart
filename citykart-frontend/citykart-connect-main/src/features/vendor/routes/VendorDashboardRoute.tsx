import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DollarSign, Package, Plus, Store, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/auth-context";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VendorProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  status: "active" | "draft";
}

export default function VendorDashboardRoute() {
  const { user, isVendor } = useAuth();
  const [myProducts, setMyProducts] = useState<VendorProduct[]>([
    { id: "vp1", name: "Handmade Candle Set", price: 599, category: "Home Decor", status: "active" },
    { id: "vp2", name: "Organic Face Cream", price: 349, category: "Beauty", status: "active" },
    { id: "vp3", name: "Bamboo Cutlery Kit", price: 299, category: "Kitchen", status: "draft" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", description: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) return <Navigate to="/auth" />;
  if (!isVendor) return <Navigate to="/" />;

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill in required fields");
      return;
    }
    setMyProducts((prev) => [
      ...prev,
      {
        id: "vp" + Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category || "General",
        status: "active",
      },
    ]);
    setNewProduct({ name: "", price: "", category: "", description: "" });
    setDialogOpen(false);
    toast.success("Product added!");
  };

  const stats = [
    { label: "Total Products", value: myProducts.length, icon: Package, color: "text-primary" },
    { label: "Active Listings", value: myProducts.filter((p) => p.status === "active").length, icon: TrendingUp, color: "text-success" },
    { label: "Total Revenue", value: "₹12,450", icon: DollarSign, color: "text-accent-foreground" },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Vendor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Product Name *</Label>
                <Input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" />
              </div>
              <div>
                <Label>Price (₹) *</Label>
                <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} placeholder="999" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Fashion" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Product description..." />
              </div>
              <Button className="w-full" onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold font-display text-card-foreground flex items-center gap-2">
            <Store className="h-5 w-5" /> Your Products
          </h2>
        </div>
        <div className="divide-y">
          {myProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-card-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">₹{product.price}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${product.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

