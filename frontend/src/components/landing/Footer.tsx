import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/10 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TripGenie AI</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-6">
            The next generation of travel planning. Discover the world with AI-crafted itineraries tailored just for you.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/planner" className="text-slate-400 hover:text-emerald-400 transition-colors">Planner</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Destinations</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Contact</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} TripGenie AI. All rights reserved.</p>
        <p className="text-slate-500 text-sm mt-2 md:mt-0 flex items-center gap-1">
          Built with <span className="text-red-500">♥</span> and Next.js
        </p>
      </div>
    </footer>
  );
}
