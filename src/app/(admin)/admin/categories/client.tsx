'use client';

import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/trpc/client';

import { AddCategoryDialog } from './add-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';

type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function CategoriesClient() {
  const router = useRouter();
  const utils = trpc.useUtils();

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  // Fetch categories with TRCP
  const categoriesQuery = trpc.categories.getMany.useSuspenseQuery();
  const categories = categoriesQuery[0] as Category[];

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success('Category deleted successfully');
      utils.categories.getMany.invalidate();
      setDeletingCategory(null);
    },
    onError: error => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  const handleDeleteCategory = useCallback((category: Category) => {
    setDeletingCategory(category);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingCategory) return;

    try {
      await deleteMutation.mutateAsync({ id: deletingCategory.id });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, [deleteMutation, deletingCategory]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="overflow-hidden border p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.description || 'No description'}
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 cursor-pointer p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="text-destructive mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AddCategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={open => !open && setEditingCategory(null)}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={open => !open && setDeletingCategory(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
