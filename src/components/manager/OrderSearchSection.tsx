// 'use client'

// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button2'
// import { Loader2, Search, RefreshCw } from 'lucide-react'
// import type { IOrder } from '@/server/models/Order'

// interface OrderSearchSectionProps {
//   orderSearchTerm: string
//   setOrderSearchTerm: (value: string) => void
//   isSearchingOrder: boolean
//   orderResults: IOrder[]
//   recentOrders: IOrder[]
//   isLoadingRecentOrders: boolean
//   selectedOrder: IOrder | null
//   searchOrders: () => void
//   selectOrder: (order: IOrder) => void
//   setSelectedOrder: (order: IOrder | null) => void
//   fetchRecentOrders: () => void
// }

// export default function OrderSearchSection({
//   orderSearchTerm,
//   setOrderSearchTerm,
//   isSearchingOrder,
//   orderResults,
//   recentOrders,
//   isLoadingRecentOrders,
//   selectedOrder,
//   searchOrders,
//   selectOrder,
//   setSelectedOrder,
//   fetchRecentOrders,
// }: OrderSearchSectionProps) {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Input
//           placeholder="Search by order number or customer name"
//           value={orderSearchTerm}
//           onChange={(e) => setOrderSearchTerm(e.target.value)}
//           className="flex-1"
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               e.preventDefault()
//               searchOrders()
//             }
//           }}
//         />
//         <Button
//           onClick={searchOrders}
//           disabled={isSearchingOrder}
//           className="bg-primary hover:bg-primary/90"
//         >
//           {isSearchingOrder ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Search className="h-4 w-4" />
//           )}
//         </Button>
//       </div>

//       {recentOrders.length > 0 && !orderResults.length && (
//         <div className="border rounded-md overflow-hidden">
//           <div className="bg-muted px-4 py-2 font-medium text-sm flex justify-between items-center">
//             <span>Recent Orders</span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={fetchRecentOrders}
//               disabled={isLoadingRecentOrders}
//               className="h-7 px-2"
//             >
//               <RefreshCw
//                 className={`h-3.5 w-3.5 ${
//                   isLoadingRecentOrders ? 'animate-spin' : ''
//                 }`}
//               />
//             </Button>
//           </div>
//           <div className="divide-y max-h-[200px] overflow-y-auto">
//             {recentOrders.map((order) => (
//               <div
//                 key={order._id?.toString()}
//                 className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 ${
//                   selectedOrder?._id === order._id ? 'bg-primary/10' : ''
//                 }`}
//                 onClick={() => selectOrder(order)}
//               >
//                 <div>
//                   <div className="font-medium">Order #{order.orderNumber}</div>
//                   <div className="text-sm text-muted-foreground">
//                     { 'Unknown'} -{' '}
//                     {order.items.length} items
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-primary hover:text-primary/90 hover:bg-primary/10"
//                 >
//                   Select
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {orderResults.length > 0 && (
//         <div className="border rounded-md overflow-hidden">
//           <div className="bg-muted px-4 py-2 font-medium text-sm">
//             Search Results
//           </div>
//           <div className="divide-y max-h-[200px] overflow-y-auto">
//             {orderResults.map((order) => (
//               <div
//                 key={order._id?.toString()}
//                 className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 ${
//                   selectedOrder?._id === order._id ? 'bg-primary/10' : ''
//                 }`}
//                 onClick={() => selectOrder(order)}
//               >
//                 <div>
//                   <div className="font-medium">Order #{order.orderNumber}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {(order as any).userId?.name || 'Unknown'} -{' '}
//                     {order.items.length} items
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-primary hover:text-primary/90 hover:bg-primary/10"
//                 >
//                   Select
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {selectedOrder && (
//         <div className="border rounded-md p-4 bg-primary/10">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-medium">Selected Order</h3>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSelectedOrder(null)}
//               className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 px-2"
//             >
//               Clear
//             </Button>
//           </div>
//           <div className="text-sm">
//             <p>
//               <span className="font-medium">Order Number:</span>{' '}
//               {selectedOrder.orderNumber}
//             </p>
//             <p>
//               <span className="font-medium">Customer:</span>{' '}
//               {(selectedOrder as any).userId?.name || 'Unknown'}
//             </p>
//             <p>
//               <span className="font-medium">Items:</span>{' '}
//               {selectedOrder.items.length}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
