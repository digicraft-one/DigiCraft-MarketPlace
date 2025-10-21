import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'DigiCraft Marketplace'
    const description = searchParams.get('description') || 'Professional pre-built software solutions including CMS, business landing pages, e-commerce platforms, and custom applications. Affordable software development and budget-friendly solutions.'
    const price = searchParams.get('price') || 'Starting from ₹999'
    const category = searchParams.get('category') || 'Software Solutions'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f0f',
            backgroundImage: 'linear-gradient(45deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(20,184,166,0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(59,130,246,0.1) 0%, transparent 50%)`,
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <img
                src="https://marketplace.digicraft.one/logo.svg"
                alt="DigiCraft Logo"
                style={{
                  width: '60px',
                  height: '60px',
                  marginRight: '20px',
                }}
              />
              <span
                style={{
                  color: '#14B8A6',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                DigiCraft Marketplace
              </span>
            </div>

            {/* Product Title */}
            <h1
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px',
                maxWidth: '800px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                color: '#9CA3AF',
                fontSize: '24px',
                marginBottom: '30px',
                maxWidth: '700px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>

            {/* Price and Category */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#14B8A6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                {price}
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(59,130,246,0.2)',
                  color: '#3B82F6',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  border: '1px solid #3B82F6',
                }}
              >
                {category}
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              color: '#6B7280',
              fontSize: '16px',
            }}
          >
            marketplace.digicraft.one
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
