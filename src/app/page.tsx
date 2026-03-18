import Image from "next/image"
import { BuyButton } from "@/components/ui/BuyButton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Laugh, Clock, Star, Quote } from "lucide-react"

export default function BookLandingPage() {
  const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL

  const featureCards = [
    {
      title: "RAW",
      desc: "This book resonates with people partly because of the time between its origin and its publication. The language and vernacular remain unsoftened, untouched by any effort to make them more palatable for a polite audience.",
      icon: AlertTriangle,
    },
    {
      title: "Satyrical",
      desc: "Through a life of radical honesty, the author has observed how the system operates and has put these writings to paper in plain, simple language-delivered with humor and disarming honesty.",
      icon: Laugh,
    },
    {
      title: "A 30 Year Perspective",
      desc: "These writings were typewritten in 1994. That detail is important, because the veil the author lifts reads as if it were written only last year.",
      icon: Clock,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="animated-gradient-bg fixed inset-0" />

      {/* Subtle overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60" />

      <div className="relative z-10">
        {/* Hero Section - Centered Layout */}
        <section className="relative overflow-hidden px-4 py-20 md:py-28 lg:py-36">
          <div className="container mx-auto max-w-6xl">
            {/* Centered Content */}
            <div className="flex flex-col items-center text-center">
              {/* Badge */}
              <div className="reveal-up">
                <Badge
                  variant="outline"
                  className="mb-8 border-primary/50 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  New Release 2026
                </Badge>
              </div>

              {/* Animated Headline */}
              <h1 className="reveal-up-delay-1 mb-6 text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block">Government by</span>
                <span
                  className="glitch-text mt-2 block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
                  data-text="Gangsterism"
                >
                  Gangsterism
                </span>
              </h1>

              {/* Subtitle */}
              <p className="reveal-up-delay-2 mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Have you read Government by Gangsterism? Lifting the veil on
                the system that has enslaved the land of the free and the home
                of the brave.
              </p>

              {heroVideoUrl ? (
                <div className="reveal-up-delay-3 relative mx-auto mb-12 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-primary/20 bg-black shadow-2xl shadow-primary/20">
                  <video
                    className="aspect-video w-full object-cover"
                    src={heroVideoUrl}
                    controls
                    playsInline
                    preload="metadata"
                  />
                </div>
              ) : null}

              {/* 3D Book Cover - Centered */}
              <div className="reveal-up-delay-3 book-3d relative mx-auto mb-12 w-full max-w-xs md:max-w-sm">
                <div className="book-3d-inner book-glitch relative aspect-[3/4.5] w-full overflow-hidden rounded-2xl shadow-2xl shadow-primary/30 ring-1 ring-primary/20">
                  <Image
                    src="/images/“On tax-paid slavery racketeering” (3).png"
                    alt="Government by Gangsterism book cover"
                    fill
                    className="book-glitch-image object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="book-shadow" />
              </div>
              {/* CTA and Reviews */}
              <div className="reveal-up-delay-4 flex flex-col items-center gap-6">
                <BuyButton size="lg" className="cta-glow h-14 px-10 text-lg">
                  Buy Now - $13.99
                </BuyButton>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < 4
                            ? "h-5 w-5 fill-primary text-primary"
                            : "h-5 w-5 text-muted-foreground/40"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium text-muted-foreground">
                    4 out of 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mx-auto my-4 max-w-4xl opacity-30" />

        {/* Why Readers Love This Book Section */}
        <section className="container mx-auto max-w-6xl px-4 pt-10 pb-20">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Why Readers Love This Book
          </h2>

          {/* Feature Cards with Custom Icons */}
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            {featureCards.map((item, i) => {
              const IconComponent = item.icon
              return (
                <Card
                  key={i}
                  className="feature-card border-none bg-card/80 shadow-lg backdrop-blur-sm"
                >
                  <CardContent className="space-y-4 p-8 text-center">
                    <div className="icon-container mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Featured Testimonial */}
          <Card className="testimonial-card mx-auto max-w-3xl border-primary/20 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <Quote className="h-10 w-10 shrink-0 text-primary/40" />
                <div className="space-y-4 text-center md:text-left">
                  <p className="text-lg italic text-foreground/90 md:text-xl">
                    &quot;This book shattered every illusion I had about the
                    system. Raw, unapologetic, and devastatingly honest. A
                    must-read for anyone who wants to understand how
                      Tax-paid Slavery Racketeering works under the veil of criminal prosecution .&quot;
                  </p>
                  <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="font-semibold">Marcus T.</span>
                    <span className="text-sm text-muted-foreground">
                      Verified Reader
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary/90 py-24 text-primary-foreground">
          {/* Background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.1)_0%,transparent_50%)]" />

          <div className="container relative mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
              {/* Mini Book Cover */}
              <div className="mini-book relative hidden aspect-[3/4.5] w-40 shrink-0 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20 lg:block">
                <Image
                  src="/images/bookcover.png"
                  alt="Government by Gangsterism"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>

              {/* CTA Content */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                {/* Urgency Badge */}
                <Badge className="urgency-badge border-white/30 bg-white/10 text-white">
                  Limited-Time Offer - Free Chapter Preview Included
                </Badge>

                <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Ready to See Behind the Curtain?
                </h2>

                <p className="mx-auto max-w-2xl text-lg opacity-90 lg:mx-0">
                  Join thousands of awakened readers who have already taken the
                  red pill. Get your copy today and start your journey into the
                  truth.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <BuyButton
                    size="lg"
                    variant="secondary"
                    className="h-14 px-12 text-lg font-semibold"
                  >
                    Get Your Copy Now - Only $13.99
                  </BuyButton>
                </div>

                <p className="text-sm opacity-70">
                  Instant digital delivery. 30-day money-back guarantee.
                </p>
              </div>

              {/* Mini Book Cover for mobile */}
              <div className="mini-book relative aspect-[3/4.5] w-32 shrink-0 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20 lg:hidden">
                <Image
                  src="/images/bookcover.png"
                  alt="Government by Gangsterism"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
