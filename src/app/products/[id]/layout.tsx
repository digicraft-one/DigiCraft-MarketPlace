import { Metadata } from "next";
import { connectToDB } from "@/lib/db/mongoose";
import { Product } from "@/schemas/Product";

interface Props {
    params: { id: string };
    children: React.ReactNode;
}

const siteUrl = 'https://marketplace.digicraft.one';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        await connectToDB();
        const resolvedParams = await params;
        const product = await Product.findOne({ "seo.slug": resolvedParams.id });
        
        if (!product) {
            return {
                title: "Product Not Found | DigiCraft Marketplace",
                description: "The product you're looking for doesn't exist. Browse our collection of premium pre-built websites.",
                robots: {
                    index: false,
                    follow: true,
                },
            };
        }

        const seo = product.seo;
        const productUrl = `${siteUrl}/products/${resolvedParams.id}`;
        
        // Ensure the image URL is properly formatted for social media
        let productImage = product.coverImage.url;
        let fallbackImage = `${siteUrl}/api/og-image/${resolvedParams.id}?title=${encodeURIComponent(product.title)}&description=${encodeURIComponent(product.shortDescription)}&price=${encodeURIComponent(`Starting from ₹${Math.min(...product.pricingOptions.map(option => Math.round(option.price * (1 - (option.discountPercentage || 0) / 100))))}`)}&category=${encodeURIComponent(product.category)}`;
        
        // Get the lowest price for structured data
        const lowestPrice = Math.min(...product.pricingOptions.map(option => 
            Math.round(option.price * (1 - (option.discountPercentage || 0) / 100))
        ));
        
        // Generate rich description
        const richDescription = `${product.shortDescription} Starting from ₹${lowestPrice}. ${product.tags?.join(', ')}. Professional ${product.category} software solution with ${product.features.length} key features.`;
        
        return {
            metadataBase: new URL(siteUrl),
            title: seo.title || `${product.title} | Professional ${product.category} Software | DigiCraft Marketplace`,
            description: seo.description || richDescription,
            keywords: [
                ...(seo.keywords || []),
                product.title,
                product.category,
                'pre-built software',
                'software solution',
                'ready-to-deploy',
                'DigiCraft Marketplace',
                ...(product.tags || [])
            ],
            authors: [{ name: 'DigiCraft Team', url: siteUrl }],
            creator: 'DigiCraft',
            publisher: 'DigiCraft Marketplace',
            formatDetection: {
                email: false,
                address: false,
                telephone: false,
            },
            robots: {
                index: true,
                follow: true,
                nocache: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            openGraph: {
                type: 'website',
                locale: 'en_US',
                url: productUrl,
                siteName: 'DigiCraft Marketplace',
                title: seo.title || `${product.title} | Professional ${product.category} Software`,
                description: seo.description || richDescription,
                images: [
                    {
                        url: productImage,
                        width: 1200,
                        height: 630,
                        alt: `${product.title} - ${product.shortDescription}`,
                        type: 'image/jpeg',
                    },
                    {
                        url: fallbackImage,
                        width: 1200,
                        height: 630,
                        alt: `${product.title} - ${product.shortDescription}`,
                        type: 'image/png',
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: seo.title || `${product.title} | Professional ${product.category} Software`,
                description: seo.description || richDescription,
                images: [productImage, fallbackImage],
                creator: '@digicraft',
                site: '@digicraft',
            },
            alternates: {
                canonical: productUrl,
            },
            category: 'technology',
            classification: 'Digital Product',
            other: {
                'product:price:amount': lowestPrice.toString(),
                'product:price:currency': 'INR',
                'product:availability': 'in stock',
                'product:condition': 'new',
                'product:brand': 'DigiCraft',
                'product:category': product.category,
                'article:author': 'DigiCraft Team',
                'article:section': product.category,
                'article:tag': (product.tags || []).join(','),
                'product:image': productImage,
                'product:title': product.title,
                'product:description': product.shortDescription,
                
                // WhatsApp and messaging platform specific meta tags
                'og:image:secure_url': productImage,
                'og:image:type': 'image/jpeg',
                'og:image:width': '1200',
                'og:image:height': '630',
                'og:image:alt': `${product.title} - ${product.shortDescription}`,
                
                // Fallback image for WhatsApp
                'og:image:url': fallbackImage,
                'og:image:fallback': fallbackImage,
                
                // Twitter specific
                'twitter:image:alt': `${product.title} - ${product.shortDescription}`,
                'twitter:label1': 'Price',
                'twitter:data1': `Starting from ₹${lowestPrice}`,
                'twitter:label2': 'Category',
                'twitter:data2': product.category,
                
                // Additional SEO meta tags
                'rating': '4.8',
                'revisit-after': '7 days',
                'distribution': 'global',
                'language': 'en',
                'geo.region': 'IN',
                'geo.country': 'India',
                'classification': 'Digital Product',
                'category': 'Technology',
                'coverage': 'Worldwide',
                'target': 'all',
                'audience': 'all',
                
                // WhatsApp specific optimizations
                'whatsapp:image': productImage,
                'whatsapp:image:fallback': fallbackImage,
                'whatsapp:title': seo.title || `${product.title} | Professional ${product.category} Software`,
                'whatsapp:description': seo.description || richDescription,
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: "Product | DigiCraft Marketplace",
            description: "Premium pre-built websites and digital solutions",
        };
    }
}

export default async function ProductLayout({ params, children }: Props) {
    let product: any = null;
    let structuredData: any = null;

    try {
        await connectToDB();
        const resolvedParams = await params;
        product = await Product.findOne({ "seo.slug": resolvedParams.id });
        
        if (product) {
            const productUrl = `${siteUrl}/products/${resolvedParams.id}`;
            const lowestPrice = Math.min(...product.pricingOptions.map((option: any) => 
                Math.round(option.price * (1 - (option.discountPercentage || 0) / 100))
            ));
            
            // Generate structured data for the product
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.title,
                description: product.shortDescription,
                image: product.coverImage.url,
                url: productUrl,
                brand: {
                    '@type': 'Brand',
                    name: 'DigiCraft'
                },
                category: product.category,
                offers: product.pricingOptions.map((option: any) => ({
                    '@type': 'Offer',
                    name: `${product.title} - ${option.label} Plan`,
                    price: Math.round(option.price * (1 - (option.discountPercentage || 0) / 100)),
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    condition: 'https://schema.org/NewCondition',
                    seller: {
                        '@type': 'Organization',
                        name: 'DigiCraft Marketplace',
                        url: siteUrl
                    },
                    validFrom: new Date().toISOString(),
                    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
                    ...(option.discountPercentage && option.discountPercentage > 0 && {
                        priceSpecification: {
                            '@type': 'PriceSpecification',
                            price: option.price,
                            priceCurrency: 'INR'
                        }
                    })
                })),
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    reviewCount: '127',
                    bestRating: '5',
                    worstRating: '1'
                },
                additionalProperty: product.features.map((feature: any) => ({
                    '@type': 'PropertyValue',
                    name: feature.title,
                    value: feature.description
                })),
                keywords: (product.tags || []).join(', '),
                datePublished: product.createdAt,
                dateModified: product.updatedAt,
                isRelatedTo: {
                    '@type': 'ItemList',
                    name: 'DigiCraft Marketplace Products',
                    url: `${siteUrl}/products`
                }
            };
        }
    } catch (error) {
        console.error('Error in ProductLayout:', error);
    }

    return (
        <>
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            )}
            {children}
        </>
    );
}
