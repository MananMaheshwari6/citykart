import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, PackagePlus, TrendingUp, CheckCircle, MoreVertical } from "lucide-react";

import { useAuth } from "@/features/auth/auth-context";
import { apiFetch, parseJsonError } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/shared/components/SmartImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type VendorProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  status: "active" | "draft";
  inStock: boolean;
  image?: string;
};

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  status: z.enum(["active", "draft"]),
});
type ProductFormValues = z.infer<typeof productSchema>;

export default function VendorDashboardRoute() {
  const { user, isVendor, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isVendor) return <Navigate to="/" replace />;

  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery<VendorProduct[]>({
    queryKey: ["vendor-products"],
    queryFn: async () => {
      const res = await apiFetch("/vendor/products");
      if (!res.ok) throw new Error(await parseJsonError(res));
      const json = (await res.json()) as { products?: VendorProduct[]; items?: VendorProduct[] };
      return json.products ?? json.items ?? [];
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VendorProduct | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0, category: "", description: "", status: "active" },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        description: editingProduct.description ?? "",
        status: editingProduct.status,
      });
    } else {
      form.reset({ name: "", price: 0, category: "", description: "", status: "active" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const url = editingProduct ? `/vendor/products/${editingProduct.id}` : "/vendor/products";
      const method = editingProduct ? "PATCH" : "POST";
      const res = await apiFetch(url, { method, body: JSON.stringify(values) });
      if (!res.ok) throw new Error(await parseJsonError(res));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-all-cats"] });
      setDialogOpen(false);
      setEditingProduct(null);
      toast.success(editingProduct ? "Product updated" : "Product added");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiFetch(`/vendor/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseJsonError(res));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-all-cats"] });
      setDeleteTarget(null);
      toast.success("Product deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openAdd = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };
  const openEdit = (p: VendorProduct) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };
  const onSubmit = (values: ProductFormValues) => saveMutation.mutate(values);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">Vendor Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your products and listings</p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border bg-card p-5">
            <div className="inline-block bg-orange-50 dark:bg-orange-950/40 rounded-xl p-2">
              <PackagePlus className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Total Products</p>
            <p className="text-3xl font-semibold text-foreground mt-1">{products.length}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="inline-block bg-green-50 dark:bg-green-950/40 rounded-xl p-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Active Listings</p>
            <p className="text-3xl font-semibold text-foreground mt-1">
              {products.filter((p) => p.status === "active").length}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="inline-block bg-blue-50 dark:bg-blue-950/40 rounded-xl p-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Total Revenue</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-semibold text-foreground">₹12,450</p>
              <Badge variant="secondary">coming soon</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Your products</h2>
            <Badge variant="secondary">{products.length}</Badge>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl w-full" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
            <p className="text-lg font-semibold text-destructive">Could not load your products</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Please try again in a moment."}
            </p>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <PackagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No products yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first product to start selling on CityKart.
            </p>
            <Button className="mt-6" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add your first product
            </Button>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:bg-accent/30 transition-colors"
              >
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                  iconFallback
                />


                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-card-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                </div>

                <div className="shrink-0 font-semibold text-foreground tabular-nums">
                  ₹{product.price.toLocaleString()}
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  {product.status === "active" ? (
                    <Badge className="bg-green-100 text-green-700 border-0 dark:bg-green-950/40 dark:text-green-300">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                  {product.inStock ? (
                    <Badge className="bg-blue-50 text-blue-700 border-0 dark:bg-blue-950/40 dark:text-blue-300">
                      In stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open product actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(product)}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(product)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setEditingProduct(null);
            form.reset({ name: "", price: 0, category: "", description: "", status: "active" });
          } else {
            setDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Fresh Spinach 500g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "-") e.preventDefault();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Vegetables" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active — visible to buyers</SelectItem>
                        <SelectItem value="draft">Draft — hidden from buyers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingProduct
                      ? "Save changes"
                      : "Add product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your store. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
