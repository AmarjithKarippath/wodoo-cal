import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getWaitlistCount } from "@/lib/db";

function displayCount(realCount: number) {
  const base = Number(process.env.WAITLIST_BASE_COUNT || 2400);
  return base + realCount;
}

export const dynamic = "force-dynamic";

export default function Home() {
  const count = displayCount(getWaitlistCount());

  return (
    <main className="landing">
      <div className="landing-inner">
        <header className="topbar">
          <Link className="brand-mark" href="/" aria-label="Wodoo home">
            <Image
              src="/logo-wo.png"
              alt="Wodoo"
              width={64}
              height={64}
              className="brand-logo"
              priority
            />
          </Link>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="brand-hero">Wodoo</p>
            <h1 className="headline">
              Track your calories
              <br />
              with just a picture
            </h1>
            <p className="support">
              AI-powered fitness app to help you track your daily diet to stay
              fit. 
              </p>
              <p>Snap a photo of your meal (or scan the barcode) to instantly
              track calories, nutrients, and your daily intake.
              </p>
            <WaitlistForm initialCount={count} />
          </div>

          <div className="hero-visual">
            <div className="app-preview-frame">
              <Image
                src="/app-preview-v3.jpg"
                alt="Wodoo app screens: food scanner, calorie dashboard, and meal nutrition breakdown"
                width={1024}
                height={767}
                priority
                className="app-preview"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
