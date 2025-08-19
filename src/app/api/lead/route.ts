import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    
    // Simulate CRM integration
    console.log('🔥 New Lead Received:', {
      brand: leadData.brand,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      zip: leadData.zip,
      serviceType: leadData.serviceType,
      address: leadData.address,
      utmSource: leadData.utmSource,
      utmMedium: leadData.utmMedium,
      utmCampaign: leadData.utmCampaign,
      timestamp: leadData.timestamp
    })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock successful CRM response
    return NextResponse.json({
      success: true,
      leadId: `LEAD-${Date.now()}`,
      message: 'Lead successfully submitted to CRM',
      nextSteps: {
        assignedTo: 'Local Sales Team',
        contactWindow: '24 hours',
        callbackPhone: leadData.phone
      }
    }, { status: 200 })

  } catch (error) {
    console.error('❌ Lead submission error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process lead'
    }, { status: 500 })
  }
}