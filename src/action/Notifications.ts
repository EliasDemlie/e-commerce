// import dbConnect from '@/lib/dbConnect'
// import Notification from '@/server/models/Notification'
// import type {
//   NotificationType,
//   OrderMetadata,
//   PriceMetadata,
//   WishlistMetadata,
//   PromotionMetadata,
//   AccountMetadata,
// } from '@/server/models/Notification'
// import Order from '@/server/models/Order'
// import type mongoose from 'mongoose'

// export async function createOrderStatusNotification(
//   orderId: string | mongoose.Types.ObjectId,
//   userId: string | mongoose.Types.ObjectId
// ) {
//   try {
//     await dbConnect()

//     const order = await Order.findById(orderId)
//     if (!order) {
//       throw new Error(`Order not found: ${orderId}`)
//     }

//     let title = ''
//     let description = ''
//     let actionText = 'View Order'

//     switch (order.orderStatus) {
//       case 'processing':
//         title = 'Order Confirmed'
//         description = `Your order #${order.orderNumber} has been confirmed and is being processed.`
//         break
//       case 'shipped':
//         title = 'Order Shipped'
//         description = `Your order #${order.orderNumber} has been shipped and is on its way!`
//         actionText = 'Track Order'
//         break
//       case 'delivered':
//         title = 'Order Delivered'
//         description = `Your order #${order.orderNumber} has been delivered. Enjoy your purchase!`
//         actionText = 'Leave Review'
//         break
//       case 'cancelled':
//         title = 'Order Cancelled'
//         description = `Your order #${order.orderNumber} has been cancelled.`
//         break
//       case 'refunded':
//         title = 'Order Refunded'
//         description = `Your order #${order.orderNumber} has been refunded.`
//         break
//       default:
//         title = 'Order Update'
//         description = `Your order #${order.orderNumber} has been updated.`
//     }

//     const metadata: OrderMetadata = {
//       orderNumber: order.orderNumber,
//       orderStatus: order.orderStatus,
//       paymentStatus: order.paymentStatus,
//       totalAmount: order.subtotal + order.tax + order.shipping,
//     }

//     const notification = await Notification.create({
//       userId,
//       type: 'order' as NotificationType,
//       title,
//       description,
//       read: false,
//       actionUrl: `/orders/${order._id}`,
//       actionText,
//       relatedId: order._id,

//       image: order.items[0]?.imageUrl,
//       metadata,
//     })

//     return notification
//   } catch (error) {
//     console.error('Error creating order notification:', error)
//     throw error
//   }
// }

// export async function createPriceDropNotification(
//   userId: string | mongoose.Types.ObjectId,
//   productId: string | mongoose.Types.ObjectId,
//   productName: string,
//   oldPrice: number,
//   newPrice: number,
//   imageUrl?: string,
//   currency = 'ETB'
// ) {
//   try {
//     await dbConnect()

//     const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)

//     const metadata: PriceMetadata = {
//       oldPrice,
//       newPrice,
//       discount,
//       currency,
//     }

//     const notification = await Notification.create({
//       userId,
//       type: 'price' as NotificationType,
//       title: 'Price Drop Alert',
//       description: `${productName} in your wishlist is now ${discount}% off!`,
//       read: false,
//       actionUrl: `/products/${productId}`,
//       actionText: 'View Product',
//       image: imageUrl,
//       relatedId: productId,
//       metadata,
//     })

//     return notification
//   } catch (error) {
//     console.error('Error creating price drop notification:', error)
//     throw error
//   }
// }

// export async function createBackInStockNotification(
//   userId: string | mongoose.Types.ObjectId,
//   productId: string | mongoose.Types.ObjectId,
//   productName: string,
//   imageUrl?: string,
//   category?: string,
//   variant?: string
// ) {
//   try {
//     await dbConnect()

//     // Create properly typed metadata
//     const metadata: WishlistMetadata = {
//       productName,
//       category,
//       variant,
//     }

//     const notification = await Notification.create({
//       userId,
//       type: 'wishlist' as NotificationType,
//       title: 'Back in Stock',
//       description: `${productName} in your wishlist is back in stock!`,
//       read: false,
//       actionUrl: `/products/${productId}`,
//       actionText: 'Add to Cart',
//       image: imageUrl,
//       relatedId: productId,
//       metadata,
//     })

//     return notification
//   } catch (error) {
//     console.error('Error creating back in stock notification:', error)
//     throw error
//   }
// }

// export async function createPromotionNotification(
//   userId: string | mongoose.Types.ObjectId,
//   title: string,
//   description: string,
//   actionUrl: string,
//   actionText: string,
//   promotionId?: string,
//   discountValue?: number,
//   discountType?: 'percentage' | 'fixed',
//   code?: string,
//   validUntil?: Date,
//   imageUrl?: string,
//   expiresAt?: Date
// ) {
//   try {
//     await dbConnect()

//     const metadata: PromotionMetadata = {
//       promotionId,
//       code,
//       discountValue,
//       discountType,
//       validUntil: validUntil?.toISOString(),
//     }

//     const notification = await Notification.create({
//       userId,
//       type: 'promotion' as NotificationType,
//       title,
//       description,
//       read: false,
//       actionUrl,
//       actionText,
//       image: imageUrl,
//       metadata,
//       expiresAt,
//     })

//     return notification
//   } catch (error) {
//     console.error('Error creating promotion notification:', error)
//     throw error
//   }
// }

// export async function createAccountNotification(
//   userId: string | mongoose.Types.ObjectId,
//   title: string,
//   description: string,
//   action?: 'password_change' | 'login' | 'profile_update' | 'email_change',
//   ipAddress?: string,
//   browser?: string,
//   location?: string,
//   actionUrl?: string,
//   actionText?: string
// ) {
//   try {
//     await dbConnect()

//     const metadata: AccountMetadata = {
//       action,
//       ipAddress,
//       browser,
//       location,
//     }

//     const notification = await Notification.create({
//       userId,
//       type: 'account' as NotificationType,
//       title,
//       description,
//       read: false,
//       actionUrl,
//       actionText,
//       metadata,
//     })

//     return notification
//   } catch (error) {
//     console.error('Error creating account notification:', error)
//     throw error
//   }
// }

// export async function getUnreadNotificationCount(
//   userId: string | mongoose.Types.ObjectId
// ) {
//   try {
//     await dbConnect()

//     const count = await Notification.countDocuments({
//       userId,
//       read: false,
//     })

//     return count
//   } catch (error) {
//     console.error('Error getting unread notification count:', error)
//     throw error
//   }
// }

// /**
//  * Delete expired notifications
//  * Note: This is handled automatically by MongoDB TTL index,
//  * but this function can be used for manual cleanup
//  */
// export async function deleteExpiredNotifications() {
//   try {
//     await dbConnect()

//     const result = await Notification.deleteMany({
//       expiresAt: { $lt: new Date() },
//     })

//     return result.deletedCount
//   } catch (error) {
//     console.error('Error deleting expired notifications:', error)
//     throw error
//   }
// }
