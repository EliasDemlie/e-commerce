// 'use client'

// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button2'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Loader2, Truck, Package, User } from 'lucide-react'
// import type { IOrder } from '@/server/models/Order'
// import type { IAddress } from '@/server/models/Address'

// interface ICarrier {
//   _id: string
//   name: string
// }

// interface ShipmentDetailsFormProps {
//   trackingNumber: string
//   setTrackingNumber: (value: string) => void
//   carrierId: string
//   setCarrierId: (value: string) => void
//   status: 'processing' | 'in_transit' | 'delivered' | 'failed' | 'returned'
//   setStatus: (value: ShipmentDetailsFormProps['status']) => void
//   dateShipped: string
//   setDateShipped: (value: string) => void
//   notes: string
//   setNotes: (value: string) => void
//   carriers: ICarrier[]
//   isLoadingCarriers: boolean
//   shippingAddress: {
//     name: string
//     email: string
//     address: Partial<IAddress>
//   }
//   setShippingAddress: (
//     value: ShipmentDetailsFormProps['shippingAddress']
//   ) => void
//   selectedOrder: IOrder | null
//   generateTrackingNumber: () => void
// }

// export default function ShipmentDetailsForm({
//   trackingNumber,
//   setTrackingNumber,
//   carrierId,
//   setCarrierId,
//   status,
//   setStatus,
//   dateShipped,
//   setDateShipped,
//   notes,
//   setNotes,
//   carriers,
//   isLoadingCarriers,
//   shippingAddress,
//   setShippingAddress,
//   selectedOrder,
//   generateTrackingNumber,
// }: ShipmentDetailsFormProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="space-y-4">
//         <div className="p-4 border rounded-md bg-card">
//           <div className="flex items-center mb-3">
//             <Truck className="h-5 w-5 text-primary mr-2" />
//             <h3 className="font-medium">Shipment Details</h3>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-end gap-2">
//               <div className="flex-1">
//                 <Label htmlFor="tracking-number">Tracking Number *</Label>
//                 <Input
//                   id="tracking-number"
//                   value={trackingNumber}
//                   onChange={(e) => setTrackingNumber(e.target.value)}
//                   placeholder="Enter tracking number"
//                   required
//                 // />
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={generateTrackingNumber}
//                 className="mb-0.5"
//               >
//                 Generate
//               </Button>
//             </div>
//             <div>
//               <Label htmlFor="carrier">Carrier *</Label>
//               <Select
//                 value={carrierId}
//                 onValueChange={setCarrierId}
//                 disabled={isLoadingCarriers}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select carrier" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {isLoadingCarriers ? (
//                     <div className="flex justify-center p-2">
//                       <Loader2 className="h-4 w-4 animate-spin text-primary" />
//                     </div>
//                   ) : (
//                     carriers.map((carrier) => (
//                       <SelectItem key={carrier._id} value={carrier._id}>
//                         {carrier.name}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="status">Status *</Label>
//               <Select value={status} onValueChange={setStatus}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="processing">Processing</SelectItem>
//                   <SelectItem value="in_transit">In Transit</SelectItem>
//                   <SelectItem value="delivered">Delivered</SelectItem>
//                   <SelectItem value="failed">Failed</SelectItem>
//                   <SelectItem value="returned">Returned</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="date-shipped">Date Shipped</Label>
//               <Input
//                 id="date-shipped"
//                 type="date"
//                 value={dateShipped}
//                 onChange={(e) => setDateShipped(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="notes">Notes</Label>
//               <Textarea
//                 id="notes"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Add any additional notes about this shipment..."
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="p-4 border rounded-md bg-card">
//           <div className="flex items-center mb-3">
//             <User className="h-5 w-5 text-primary mr-2" />
//             <h3 className="font-medium">Customer Information</h3>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="customer-name">Customer Name *</Label>
//               <Input
//                 id="customer-name"
//                 value={shippingAddress.name}
//                 onChange={(e) =>
//                   setShippingAddress({
//                     ...shippingAddress,
//                     name: e.target.value,
//                   })
//                 }
//                 placeholder="Enter customer name"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="customer-email">Customer Email</Label>
//               <Input
//                 id="customer-email"
//                 type="email"
//                 value={shippingAddress.email}
//                 onChange={(e) =>
//                   setShippingAddress({
//                     ...shippingAddress,
//                     email: e.target.value,
//                   })
//                 }
//                 placeholder="Enter customer email"
//               />
//             </div>
//             <div>
//               <Label htmlFor="phone-number">Phone Number</Label>
//               <Input
//                 id="phone-number"
//                 value={shippingAddress.address.phoneNumber || ''}
//                 onChange={(e) =>
//                   setShippingAddress({
//                     ...shippingAddress,
//                     address: {
//                       ...shippingAddress.address,
//                       phoneNumber: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div>
//               <Label htmlFor="address-line1">Address Line 1 *</Label>
//               <Input
//                 id="address-line1"
//                 value={shippingAddress.address.addressLine1 || ''}
//                 onChange={(e) =>
//                   setShippingAddress({
//                     ...shippingAddress,
//                     address: {
//                       ...shippingAddress.address,
//                       addressLine1: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="Enter address line 1"
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="address-line2">Address Line 2</Label>
//               <Input
//                 id="address-line2"
//                 value={shippingAddress.address.addressLine2 || ''}
//                 onChange={(e) =>
//                   setShippingAddress({
//                     ...shippingAddress,
//                     address: {
//                       ...shippingAddress.address,
//                       addressLine2: e.target.value,
//                     },
//                   })
//                 }
//                 placeholder="Enter address line 2 (optional)"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <Label htmlFor="city">City *</Label>
//                 <Input
//                   id="city"
//                   value={shippingAddress.address.city || ''}
//                   onChange={(e) =>
//                     setShippingAddress({
//                       ...shippingAddress,
//                       address: {
//                         ...shippingAddress.address,
//                         city: e.target.value,
//                       },
//                     })
//                   }
//                   placeholder="Enter city"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="state">State/Province *</Label>
//                 <Input
//                   id="state"
//                   value={shippingAddress.address.state || ''}
//                   onChange={(e) =>
//                     setShippingAddress({
//                       ...shippingAddress,
//                       address: {
//                         ...shippingAddress.address,
//                         state: e.target.value,
//                       },
//                     })
//                   }
//                   placeholder="Enter state"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <Label htmlFor="postal-code">Postal Code *</Label>
//                 <Input
//                   id="postal-code"
//                   value={shippingAddress.address.postalCode || ''}
//                   onChange={(e) =>
//                     setShippingAddress({
//                       ...shippingAddress,
//                       address: {
//                         ...shippingAddress.address,
//                         postalCode: e.target.value,
//                       },
//                     })
//                   }
//                   placeholder="Enter postal code"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="country">Country *</Label>
//                 <Input
//                   id="country"
//                   value={shippingAddress.address.country || ''}
//                   onChange={(e) =>
//                     setShippingAddress({
//                       ...shippingAddress,
//                       address: {
//                         ...shippingAddress.address,
//                         country: e.target.value,
//                       },
//                     })
//                   }
//                   placeholder="Enter country"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {selectedOrder?.items?.length > 0 && (
//           <div className="p-4 border rounded-md bg-card">
//             <div className="flex items-center mb-3">
//               <Package className="h-5 w-5 text-primary mr-2" />
//               <h3 className="font-medium">Items</h3>
//             </div>
//             <div className="max-h-[200px] overflow-y-auto divide-y">
//               {selectedOrder?.items.map((item, index) => (
//                 <div key={index} className="py-2 flex justify-between">
//                   <div className="text-sm">
//                     <span className="font-medium">{item.name}</span>
//                     <div className="text-xs text-muted-foreground">
//                       ID: {item.productId.toString().slice(0, 8)}...
//                     </div>
//                   </div>
//                   <div className="text-sm font-medium">x{item.quantity}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
