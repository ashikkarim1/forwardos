import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Mock in-memory storage (replace with real database)
const mockListings: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get('industry')
    const location = searchParams.get('location')
    const minRevenue = searchParams.get('minRevenue')
    const maxRevenue = searchParams.get('maxRevenue')
    const sort = searchParams.get('sort') || 'newest'

    let filtered = mockListings.filter(l => l.status === 'published')

    if (industry) {
      filtered = filtered.filter(l => l.industry === industry)
    }
    if (location) {
      filtered = filtered.filter(l => l.city.toLowerCase().includes(location.toLowerCase()) || l.country.toLowerCase().includes(location.toLowerCase()))
    }
    if (minRevenue) {
      filtered = filtered.filter(l => l.revenue >= parseInt(minRevenue))
    }
    if (maxRevenue) {
      filtered = filtered.filter(l => l.revenue <= parseInt(maxRevenue))
    }

    // Sort
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.askingPrice - b.askingPrice)
        break
      case 'price-high':
        filtered.sort((a, b) => b.askingPrice - a.askingPrice)
        break
      case 'revenue-low':
        filtered.sort((a, b) => a.revenue - b.revenue)
        break
      case 'revenue-high':
        filtered.sort((a, b) => b.revenue - a.revenue)
        break
      case 'viewed':
        filtered.sort((a, b) => b.viewsCount - a.viewsCount)
        break
      case 'saved':
        filtered.sort((a, b) => b.savesCount - a.savesCount)
        break
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newListing = {
      id: uuidv4(),
      ...body,
      viewsCount: 0,
      savesCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
    }

    mockListings.push(newListing)

    return NextResponse.json(newListing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    const body = await request.json()
    const index = mockListings.findIndex(l => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    mockListings[index] = {
      ...mockListings[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockListings[index])
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 })
    }

    const index = mockListings.findIndex(l => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const deleted = mockListings.splice(index, 1)

    return NextResponse.json(deleted[0])
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }
}
