// Chapa payment integration helper functions
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY as string
const CHAPA_BASE_URL = 'https://api.chapa.co/v1/transaction/initialize'
const CHAPA_VERIFY_URL = 'https://api.chapa.co/v1/transaction/verify/'

export interface ChapaPaymentData {
  amount: number
  currency: string
  email: string
  first_name: string
  last_name: string
  tx_ref: string
  callback_url: string
  return_url: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
}

export async function initializePayment(paymentData: ChapaPaymentData) {
  
  try {
    const response = await fetch(CHAPA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize payment')
    }

    return data
  } catch (error) {
    console.error('Chapa payment initialization error:', error)
    throw error
  }
}

export async function verifyPayment(txRef: string) {
  
  try {
    const response = await fetch(`${CHAPA_VERIFY_URL}${txRef}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    })

    const data = await response.json()
     
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment')
    }
    
    return data
  } catch (error) {
    console.error('Chapa payment verification error:', error)
    throw error
  }
}
