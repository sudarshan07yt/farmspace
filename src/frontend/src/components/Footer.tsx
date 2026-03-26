import { Leaf } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer style={{ backgroundColor: "oklch(0.28 0.08 160)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
              >
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Farmspace</span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.70 0.02 155)" }}
            >
              AI-powered crop health diagnosis for farmers and agriculture
              students. Get instant, expert-level analysis for 50+ crops —
              completely free.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Features</h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "oklch(0.70 0.02 155)" }}
            >
              <li>AI Crop Diagnosis</li>
              <li>Organic Solutions</li>
              <li>Smart Farming Tips</li>
              <li>Diagnosis History</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Supported Crops
            </h4>
            <ul
              className="space-y-2 text-sm"
              style={{ color: "oklch(0.70 0.02 155)" }}
            >
              <li>Wheat · Rice · Tomato</li>
              <li>Potato · Corn · Cotton</li>
              <li>Onion · Soybean</li>
              <li>Sugarcane · Mango</li>
            </ul>
          </div>
        </div>

        <div
          className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "oklch(0.40 0.06 158)" }}
        >
          <p className="text-xs" style={{ color: "oklch(0.60 0.02 155)" }}>
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
