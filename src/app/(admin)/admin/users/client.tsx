'use client';

import {
  Ban,
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/trpc/client';

type SortField = 'name' | 'email' | 'role' | 'banned' | 'createdAt';

export function UsersClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7');

  const { data: users = [], refetch } = trpc.users.getMany.useQuery();
  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      toast.success('User deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success('User updated successfully');
      refetch();
      setBanDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField],
  );

  const renderSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) return null;
      return sortDirection === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      );
    },
    [sortField, sortDirection],
  );

  const handleDelete = useCallback(
    async (userId: string) => {
      await deleteUser.mutateAsync({ id: userId });
    },
    [deleteUser],
  );

  const handleBan = useCallback(
    async (userId: string) => {
      const banExpires = new Date();
      banExpires.setDate(
        banExpires.getDate() + Number.parseInt(banDuration, 10),
      );

      await updateUser.mutateAsync({
        id: userId,
        banned: true,
        banReason,
        banExpires,
      });
    },
    [updateUser, banReason, banDuration],
  );

  const handleUnban = useCallback(
    async (userId: string) => {
      await updateUser.mutateAsync({
        id: userId,
        banned: false,
        banReason: null,
        banExpires: null,
      });
    },
    [updateUser],
  );

  const handleRoleChange = useCallback(
    async (userId: string, newRole: 'admin' | 'user') => {
      await updateUser.mutateAsync({
        id: userId,
        role: newRole,
      });
    },
    [updateUser],
  );

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchQuery, sortField, sortDirection]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Card className="overflow-hidden border p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[300px] cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  User Details
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon('email')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Role
                  {renderSortIcon('role')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('banned')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIcon('banned')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Joined
                  {renderSortIcon('createdAt')}
                </div>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="h-full w-full rounded-full object-cover"
                            sizes="40px"
                            priority={false}
                          />
                        ) : (
                          <span className="text-lg font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role || 'user'}
                      onValueChange={value =>
                        handleRoleChange(user.id, value as 'admin' | 'user')
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <span className="text-destructive">Banned</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user.id);
                            if (user.banned) {
                              handleUnban(user.id);
                            } else {
                              setBanDialogOpen(true);
                            }
                          }}
                        >
                          {user.banned ? (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Unban User
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Ban User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedUser(user.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDelete(selectedUser)}
              disabled={!selectedUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Enter the reason for banning this user and select the duration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="banReason"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Reason
              </label>
              <Input
                id="banReason"
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="banDuration"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Duration (days)
              </label>
              <Input
                id="banDuration"
                type="number"
                min="1"
                value={banDuration}
                onChange={e => setBanDuration(e.target.value)}
                placeholder="Enter ban duration in days..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleBan(selectedUser)}
              disabled={!selectedUser || !banReason}
            >
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
