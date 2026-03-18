import Link from "next/link"

type SuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string
  }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams
  const sessionId = resolvedSearchParams?.session_id

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-20">
      <div className="animated-gradient-bg fixed inset-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60" />

      <section className="relative z-10 container mx-auto max-w-2xl">
        <div className="rounded-2xl border border-primary/30 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-sm md:p-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Purchase Complete
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Thank you for your order
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Your payment was successful. You will receive shipping updates as
            your book is processed and dispatched.
          </p>

          {sessionId ? (
            <p className="mb-8 rounded-lg border border-border/80 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
              Session ID: {sessionId}
            </p>
          ) : null}

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
