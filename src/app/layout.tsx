import { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = 'https://marketplace.digicraft.one';
const previewImage = `${siteUrl}/preview.png`;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'DigiCraft Marketplace - Ready-to-Launch Websites & Pre-built Solutions',
        template: '%s | DigiCraft Marketplace'
    },
    description: 'DigiCraft Marketplace offers premium pre-built e-commerce and portfolio websites ready for immediate deployment. Save time and money with our customizable, professional website solutions.',
    keywords: [
        'pre-built websites',
        'e-commerce templates',
        'portfolio websites',
        'ready-to-launch websites',
        'website marketplace',
        'customizable websites',
        'professional website templates',
        'business websites',
        'online store templates',
        'website reseller',
        'digital products',
        'web solutions',
        'website packages',
        'instant websites',
        'website templates',
        'DigiCraft Marketplace',
        'website marketplace'
    ],
    authors: [{ name: 'DigiCraft Team', url: siteUrl }],
    creator: 'DigiCraft',
    publisher: 'DigiCraft Marketplace',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/logo.svg',
        shortcut: '/logo.svg',
        apple: '/logo.svg',
        other: [
            {
                rel: 'icon',
                type: 'image/svg+xml',
                url: '/logo.svg',
            },
            {
                rel: 'mask-icon',
                url: '/logo.svg',
                color: '#14B8A6'
            },
            {
                rel: 'apple-touch-icon',
                url: '/logo.svg',
            }
        ],
    },
    manifest: '/manifest.json',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: 'DigiCraft Marketplace',
        title: 'DigiCraft Marketplace - Ready-to-Launch Websites',
        description: 'Premium pre-built e-commerce and portfolio websites ready for immediate deployment. Save time and money with our customizable, professional website solutions.',
        images: [
            {
                url: previewImage,
                width: 1200,
                height: 630,
                alt: 'DigiCraft Marketplace - Ready-to-Launch Websites',
                type: 'image/png',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DigiCraft Marketplace - Ready-to-Launch Websites',
        description: 'Premium pre-built e-commerce and portfolio websites ready for immediate deployment. Save time and money with our customizable, professional website solutions.',
        images: [previewImage],
        creator: '@digicraft',
        site: '@digicraft',
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
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
    },
    alternates: {
        canonical: siteUrl,
        languages: {
            'en-US': siteUrl,
        },
    },
    category: 'technology',
    classification: 'Digital Marketplace',
    referrer: 'origin-when-cross-origin',
    other: {
        'msapplication-TileColor': '#0f0f0f',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-title': 'DigiCraft Marketplace',
        'apple-mobile-web-app-status-bar-style': 'black',
        'theme-color': '#0f0f0f'
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-P4QMFE0EC0"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-P4QMFE0EC0');
                    `}
                </Script>

                <meta name="theme-color" content="#0f0f0f" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <link rel="manifest" href="/manifest.json" />

                {/* Explicit favicon declarations */}
                <link rel="icon" type="image/svg+xml" href="/logo.svg" />
                <link rel="alternate icon" type="image/svg+xml" href="/logo.svg" />
                <link rel="apple-touch-icon" href="/logo.svg" />
                <link rel="mask-icon" href="/logo.svg" color="#14B8A6" />

                {/* WhatsApp and Open Graph specific meta tags */}
                <meta property="og:image" content={previewImage} />
                <meta property="og:image:secure_url" content={previewImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="DigiCraft Marketplace - Ready-to-Launch Websites" />

                {/* WhatsApp specific */}
                <meta property="og:site_name" content="DigiCraft Marketplace" />
                <meta property="og:title" content="DigiCraft Marketplace - Ready-to-Launch Websites" />
                <meta property="og:description" content="Premium pre-built e-commerce and portfolio websites ready for immediate deployment." />

                {/* Preconnect to important domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Preload critical assets */}
                <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
                <link rel="preload" href={previewImage} as="image" />
            </head>
            <body className={`${inter.className} bg-[#0f0f0f] text-white`}>
                {children}
                <Toaster />

                {/* Structured Data for Marketplace */}
                <Script
                    id="marketplace-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'DigiCraft Marketplace',
                            alternateName: 'DigiCraft Website Marketplace',
                            url: siteUrl,
                            description: 'Premium pre-built e-commerce and portfolio websites ready for immediate deployment',
                            potentialAction: {
                                '@type': 'SearchAction',
                                target: `${siteUrl}/search?q={search_term_string}`,
                                'query-input': 'required name=search_term_string'
                            }
                        })
                    }}
                />

                {/* Organization Structured Data */}
                <Script
                    id="organization-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'DigiCraft Marketplace',
                            alternateName: 'DigiCraft Website Marketplace',
                            url: siteUrl,
                            logo: `${siteUrl}/logo.svg`,
                            image: previewImage,
                            sameAs: [
                                'https://twitter.com/digicraft',
                                'https://facebook.com/digicraft',
                                'https://linkedin.com/company/digicraft',
                                'https://instagram.com/digicraft'
                            ],
                            contactPoint: {
                                '@type': 'ContactPoint',
                                contactType: 'customer service',
                                areaServed: 'Worldwide',
                                availableLanguage: ['English']
                            }
                        })
                    }}
                />

                {/* Product Collection Structured Data */}
                <Script
                    id="product-collection-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'ItemList',
                            name: 'Pre-built Website Collection',
                            description: 'Collection of premium pre-built e-commerce and portfolio websites',
                            url: siteUrl,
                            numberOfItems: 50,
                            itemListElement: [
                                {
                                    '@type': 'ListItem',
                                    position: 1,
                                    item: {
                                        '@type': 'SoftwareApplication',
                                        name: 'E-Commerce Store Pro',
                                        description: 'Full-featured e-commerce website with payment integration',
                                        applicationCategory: 'E-commerce',
                                        operatingSystem: 'Web Browser',
                                        offers: {
                                            '@type': 'Offer',
                                            price: '149',
                                            priceCurrency: 'USD',
                                            availability: 'https://schema.org/InStock'
                                        }
                                    }
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 2,
                                    item: {
                                        '@type': 'SoftwareApplication',
                                        name: 'Portfolio Showcase',
                                        description: 'Professional portfolio website for creatives',
                                        applicationCategory: 'Portfolio',
                                        operatingSystem: 'Web Browser',
                                        offers: {
                                            '@type': 'Offer',
                                            price: '99',
                                            priceCurrency: 'USD',
                                            availability: 'https://schema.org/InStock'
                                        }
                                    }
                                }
                            ]
                        })
                    }}
                />

                {/* Local Business Structured Data */}
                <Script
                    id="local-business-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'LocalBusiness',
                            name: 'DigiCraft Marketplace',
                            image: previewImage,
                            '@id': siteUrl,
                            url: siteUrl,
                            priceRange: '$$',
                            address: {
                                '@type': 'PostalAddress',
                                addressCountry: 'India'
                            },
                            aggregateRating: {
                                '@type': 'AggregateRating',
                                ratingValue: '4.9',
                                reviewCount: '127'
                            },
                            hasOfferCatalog: {
                                '@type': 'OfferCatalog',
                                name: 'Website Templates',
                                itemListElement: [
                                    {
                                        '@type': 'Offer',
                                        itemOffered: {
                                            '@type': 'SoftwareApplication',
                                            name: 'E-commerce Templates'
                                        }
                                    },
                                    {
                                        '@type': 'Offer',
                                        itemOffered: {
                                            '@type': 'SoftwareApplication',
                                            name: 'Portfolio Templates'
                                        }
                                    }
                                ]
                            }
                        })
                    }}
                />
                
            </body>
        </html>
    );
}
