import { NextResponse } from "next/server"
import ProductQuestion from "@/server/models/Questions"
import dbConnect from "@/lib/dbConnect"
export async function POST(request: Request) {  
  try {
    const data = await request.json()
    console.log('Received data:', data)

    await dbConnect()
    
    const question = new ProductQuestion({
      productId: data.productId,
      question: data.question,
      askedBy: data.name,
      email: data.email,
      isVerifiedPurchase: data.isVerifiedPurchase,
    })

    await question.save()

    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully',
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error submitting question:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error('Error submitting question:', error)
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const status = searchParams.get("status")

    await dbConnect()

    const questions = await ProductQuestion.find({
      productId,
      ...(status && { status }),
    }).sort({ createdAt: -1 })

    return NextResponse.json(questions)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching questions:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error("Error fetching questions:", error)
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      )
    }
  }
}