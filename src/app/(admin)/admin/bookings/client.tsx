'use client';

import { format } from 'date-fns';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Info,
  MoreHorizontal,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';

type BookingStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

type Booking = {
  id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  status: BookingStatus;
  isOver18: boolean;
  drivingLicenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  car: {
    id: string;
    name: string;
    imageUrl: string | null;
    pricePerDay: string;
  };
};

type SortField =
  | 'createdAt'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'totalPrice';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | BookingStatus;

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/images/defaultcar.jpg';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    case 'approved': {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    case 'completed': {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    case 'cancelled': {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    default: {
      return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': {
      return <Clock className="mr-1 h-4 w-4" />;
    }
    case 'approved': {
      return <CheckCircle2 className="mr-1 h-4 w-4" />;
    }
    case 'completed': {
      return <Info className="mr-1 h-4 w-4" />;
    }
    case 'cancelled': {
      return <XCircle className="mr-1 h-4 w-4" />;
    }
    default: {
      return null;
    }
  }
};

export function PageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [isMobileView, setIsMobileView] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>('pending');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkIfMobile();

    // resize listener ?
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const utils = trpc.useUtils();
  const bookingsQuery = trpc.booking.getAll.useSuspenseQuery();
  const bookings = bookingsQuery[0] as Booking[];

  const updateStatusMutation = trpc.booking.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Booking status updated successfully');
      utils.booking.getAll.invalidate();
      setIsUpdateDialogOpen(false);
      setSelectedBooking(null);
    },
    onError: error => {
      toast.error(`Failed to update booking: ${error.message}`);
    },
  });

  const handleUpdateStatus = (booking: Booking, status: BookingStatus) => {
    setSelectedBooking(booking);
    setNewStatus(status);
    setIsUpdateDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedBooking || !newStatus) return;

    updateStatusMutation.mutate({
      id: selectedBooking.id,
      status: newStatus,
    });
  };

  const showBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(booking => {
        // status filter section
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
          return false;
        }

        // search query - car name, user name, or booking ID
        // fetch data that matches the search query
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          return (
            booking.car.name.toLowerCase().includes(query) ||
            booking.user.name.toLowerCase().includes(query) ||
            booking.user.email.toLowerCase().includes(query) ||
            booking.id.toLowerCase().includes(query) ||
            booking.drivingLicenseNumber.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // sorting
        if (sortField === 'createdAt') {
          return sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortField === 'startDate') {
          return sortDirection === 'asc'
            ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }

        if (sortField === 'endDate') {
          return sortDirection === 'asc'
            ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        }

        if (sortField === 'totalPrice') {
          return sortDirection === 'asc'
            ? Number.parseFloat(a.totalPrice) - Number.parseFloat(b.totalPrice)
            : Number.parseFloat(b.totalPrice) - Number.parseFloat(a.totalPrice);
        }

        if (sortField === 'status') {
          const statusOrder = {
            pending: 1,
            approved: 2,
            completed: 3,
            cancelled: 4,
          };
          const aValue = statusOrder[a.status] || 0;
          const bValue = statusOrder[b.status] || 0;

          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
  }, [bookings, searchQuery, sortField, sortDirection, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="h-full w-full">
      <Card className="rounded-none border-0 shadow-none">
        <CardHeader className="pt-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Bookings Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex w-full flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <div className="relative w-full sm:w-80">
                <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search car, user or license number..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={value => setStatusFilter(value as FilterStatus)}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)] md:h-[calc(100vh-180px)]">
            <div className="relative">
              {isMobileView ? (
                // card view for mobile (different component)
                <div className="grid grid-cols-1 gap-4 px-2 pb-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-muted-foreground py-8 text-center">
                      No bookings found.
                    </div>
                  ) : (
                    filteredBookings.map(booking => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center border-b p-3">
                            <div className="h-14 w-14 overflow-hidden rounded-md border">
                              <Image
                                src={
                                  booking.car.imageUrl ||
                                  '/images/defaultcar.jpg'
                                }
                                alt={booking.car.name}
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                                onError={handleImageError}
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="font-medium">
                                {booking.car.name}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {/* format the price */}
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(
                                  Number.parseFloat(booking.car.pricePerDay),
                                )}{' '}
                                per day
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                'ml-auto flex items-center text-xs font-medium',
                                getStatusColor(booking.status),
                              )}
                              variant="outline"
                            >
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">
                                {booking.status}
                              </span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3">
                            <div>
                              <div className="text-muted-foreground text-xs">
                                Customer
                              </div>
                              <div className="truncate text-sm">
                                {booking.user.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">
                                Price
                              </div>
                              <div className="text-sm font-medium">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(
                                  Number.parseFloat(booking.totalPrice),
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">
                                Start Date
                              </div>
                              <div className="text-sm">
                                {format(new Date(booking.startDate), 'PP')}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs">
                                End Date
                              </div>
                              <div className="text-sm">
                                {format(new Date(booking.endDate), 'PP')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t p-3">
                            <div className="text-muted-foreground text-xs">
                              Created{' '}
                              {format(new Date(booking.createdAt), 'PP')}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => showBookingDetails(booking)}
                              >
                                <Info className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[200px]"
                                >
                                  {booking.status !== 'approved' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'approved')
                                      }
                                      className="text-green-600"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                      Approve Booking
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'completed' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'completed')
                                      }
                                      className="text-blue-600"
                                    >
                                      <Info className="mr-2 h-4 w-4 text-blue-600" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'cancelled' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'cancelled')
                                      }
                                      className="text-red-600"
                                    >
                                      <X className="mr-2 h-4 w-4 text-red-600" />
                                      Cancel Booking
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'pending' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'pending')
                                      }
                                      className="text-yellow-600"
                                    >
                                      <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                                      Return to Pending
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                // Desktop table view - existing code
                <Table className="relative">
                  <TableHeader className="bg-background sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[60px]">Car</TableHead>
                      <TableHead className="w-[200px]">Car Details</TableHead>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead
                        className="w-[110px] cursor-pointer"
                        onClick={() => handleSort('startDate')}
                      >
                        <div className="flex items-center">
                          Start Date
                          {renderSortIcon('startDate')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[110px] cursor-pointer"
                        onClick={() => handleSort('endDate')}
                      >
                        <div className="flex items-center">
                          End Date
                          {renderSortIcon('endDate')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[100px] cursor-pointer"
                        onClick={() => handleSort('totalPrice')}
                      >
                        <div className="flex items-center">
                          Price
                          {renderSortIcon('totalPrice')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[120px] cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {renderSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[110px] cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Created
                          {renderSortIcon('createdAt')}
                        </div>
                      </TableHead>
                      <TableHead className="w-[70px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map(booking => (
                        <TableRow key={booking.id} className="group">
                          <TableCell>
                            <div className="h-14 w-14 overflow-hidden rounded-md border">
                              <Image
                                src={
                                  booking.car.imageUrl ||
                                  '/images/defaultcar.jpg'
                                }
                                alt={booking.car.name}
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                                onError={handleImageError}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {booking.car.name}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(
                                Number.parseFloat(booking.car.pricePerDay),
                              )}{' '}
                              per day
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={booking.user.image || undefined}
                                />
                                <AvatarFallback>
                                  {booking.user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {booking.user.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {booking.user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(booking.startDate), 'PP')}
                          </TableCell>
                          <TableCell>
                            {format(new Date(booking.endDate), 'PP')}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(Number.parseFloat(booking.totalPrice))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Badge
                                className={cn(
                                  'flex items-center text-xs font-medium',
                                  getStatusColor(booking.status),
                                )}
                                variant="outline"
                              >
                                {getStatusIcon(booking.status)}
                                <span className="capitalize">
                                  {booking.status}
                                </span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(booking.createdAt), 'PP')}
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <DropdownMenu>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 cursor-pointer p-0"
                                      >
                                        <span className="sr-only">Open</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Actions</p>
                                  </TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[200px]"
                                >
                                  <DropdownMenuItem
                                    onClick={() => showBookingDetails(booking)}
                                    className="cursor-pointer"
                                  >
                                    <Info className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {booking.status !== 'approved' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'approved')
                                      }
                                      className="cursor-pointer text-green-600 focus:text-green-600"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                      Approve Booking
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'completed' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'completed')
                                      }
                                      className="cursor-pointer text-blue-600 focus:text-blue-600"
                                    >
                                      <Info className="mr-2 h-4 w-4 text-blue-600" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'cancelled' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'cancelled')
                                      }
                                      className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                      <X className="mr-2 h-4 w-4 text-red-600" />
                                      Cancel Booking
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status !== 'pending' && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateStatus(booking, 'pending')
                                      }
                                      className="cursor-pointer text-yellow-600 focus:text-yellow-600"
                                    >
                                      <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                                      Return to Pending
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this booking?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBooking && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Car:</span>{' '}
                  {selectedBooking.car.name}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Customer:</span>{' '}
                  {selectedBooking.user.name}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Current Status:</span>{' '}
                  <Badge
                    className={cn(
                      'ml-1',
                      getStatusColor(selectedBooking.status),
                    )}
                    variant="outline"
                  >
                    <span className="capitalize">{selectedBooking.status}</span>
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">New Status:</span>{' '}
                  <Badge
                    className={cn('ml-1', getStatusColor(newStatus))}
                    variant="outline"
                  >
                    <span className="capitalize">{newStatus}</span>
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={confirmStatusUpdate}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={selectedBooking.user.image || undefined}
                        />
                        <AvatarFallback>
                          {selectedBooking.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {selectedBooking.user.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {selectedBooking.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">License Number:</span>{' '}
                      {selectedBooking.drivingLicenseNumber}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">18:</span>{' '}
                      {selectedBooking.isOver18 ? (
                        <span className="text-green-600">
                          <CheckCircle2 className="inline h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-red-600">
                          <X className="inline h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Car Information
                  </h3>
                  <div className="flex items-start gap-2">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={
                          selectedBooking.car.imageUrl ||
                          '/images/defaultcar.jpg'
                        }
                        alt={selectedBooking.car.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div>
                      <div className="font-medium">
                        {selectedBooking.car.name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(
                          Number.parseFloat(selectedBooking.car.pricePerDay),
                        )}{' '}
                        per day
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Booking Information
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-semibold">Booking ID:</span>{' '}
                      <span className="font-mono">{selectedBooking.id}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Status:</span>{' '}
                      <Badge
                        className={cn(getStatusColor(selectedBooking.status))}
                        variant="outline"
                      >
                        {getStatusIcon(selectedBooking.status)}
                        <span className="capitalize">
                          {selectedBooking.status}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Total Price:</span>{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(Number.parseFloat(selectedBooking.totalPrice))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Dates</h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-semibold">Start Date:</span>{' '}
                      {format(new Date(selectedBooking.startDate), 'PPP')}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">End Date:</span>{' '}
                      {format(new Date(selectedBooking.endDate), 'PPP')}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Created:</span>{' '}
                      {format(new Date(selectedBooking.createdAt), 'PPP')}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Last Updated:</span>{' '}
                      {format(new Date(selectedBooking.updatedAt), 'PPP')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  {selectedBooking.status !== 'approved' && (
                    <Button
                      onClick={() => {
                        setDetailsDialogOpen(false);
                        handleUpdateStatus(selectedBooking, 'approved');
                      }}
                      size="sm"
                      className="cursor-pointer bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {selectedBooking.status !== 'completed' && (
                    <Button
                      onClick={() => {
                        setDetailsDialogOpen(false);
                        handleUpdateStatus(selectedBooking, 'completed');
                      }}
                      size="sm"
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  )}
                </div>
                {selectedBooking.status !== 'cancelled' && (
                  <Button
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleUpdateStatus(selectedBooking, 'cancelled');
                    }}
                    size="sm"
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
