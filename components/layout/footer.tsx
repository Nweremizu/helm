import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import React from "react";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CircleIcon } from "@phosphor-icons/react/dist/ssr/Circle";
import { TwitterLogoIcon } from "@phosphor-icons/react/dist/ssr/TwitterLogo";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-12 overflow-hidden">
      {/* Container with rounded top - creates the "Sheet" effect */}
      <div className="bg-primary text-white rounded-t-[3rem] md:rounded-t-[4rem] relative overflow-hidden ">
        {/* --- Background Geometry --- */}
        {/* Large subtle rings to denote global scale */}
        <div className="absolute top-0 right-0 w-150 h-150 border border-white/5 rounded-full transform translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-100 h-100 border border-white/5 rounded-full transform translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* --- TOP SECTION: Major CTA --- */}
          {/* Split layout: Big Text Left, Big Button Right */}
          <div className="flex flex-col md:flex-row border-b border-white/10">
            <div className="flex-1 p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.9]">
                Take control <br />
                <span className="text-accent-tertiary">of your future.</span>
              </h2>
            </div>

            <div className="md:w-1/3 p-8 md:p-16 flex flex-col justify-center items-start md:items-center bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group cursor-pointer">
              <button className="flex items-center gap-4 group">
                <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                  Start Free Trial
                </span>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary transform group-hover:-rotate-45 transition-transform duration-300">
                  <ArrowRightIcon weight="bold" size={20} />
                </div>
              </button>
            </div>
          </div>

          {/* --- MIDDLE SECTION: Links & Newsletter --- */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* BRAND & NEWSLETTER (Span 5 cols) */}
            <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Image
                    src={"/logo-white.png"}
                    alt="Helm Logo"
                    width={128}
                    height={32}
                  />
                </div>
                <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                  The financial operating system for modern life. Secure,
                  automated, and designed for growth.
                </p>
              </div>

              {/* Newsletter Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeSimpleIcon
                    className="text-gray-500 group-focus-within:text-accent-tertiary transition-colors"
                    size={20}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Enter email for updates"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-primary rounded-lg font-bold text-xs uppercase hover:bg-accent-tertiary transition-colors">
                  Join
                </button>
              </div>
            </div>

            {/* LINKS COLUMNS (Span 7 cols) */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3">
              {/* Col 1 */}
              <div className="p-8 md:p-12 border-r border-b md:border-b-0 border-white/10 hover:bg-white/5 transition-colors duration-300">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Product
                </h4>
                <ul className="space-y-4">
                  {["Features", "Pricing", "Security", "Download"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all hover:translate-x-1 group"
                        >
                          {item}
                          <CaretRightIcon
                            className="opacity-0 group-hover:opacity-100 text-accent-tertiary transition-opacity"
                            size={12}
                            weight="bold"
                          />
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Col 2 */}
              <div className="p-8 md:p-12 border-r border-b md:border-b-0 border-white/10 hover:bg-white/5 transition-colors duration-300">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Resources
                </h4>
                <ul className="space-y-4">
                  {["Blog", "Help Center", "Calculators", "Community"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all hover:translate-x-1 group"
                        >
                          {item}
                          <CaretRightIcon
                            className="opacity-0 group-hover:opacity-100 text-accent-tertiary transition-opacity"
                            size={12}
                            weight="bold"
                          />
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Col 3 */}
              <div className="p-8 md:p-12 hover:bg-white/5 transition-colors duration-300">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Company
                </h4>
                <ul className="space-y-4">
                  {["About Us", "Careers", "Legal", "Contact"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all hover:translate-x-1 group"
                      >
                        {item}
                        <CaretRightIcon
                          className="opacity-0 group-hover:opacity-100 text-accent-tertiary transition-opacity"
                          size={12}
                          weight="bold"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* --- BOTTOM SECTION: Footer Bar --- */}
          <div className="border-t border-white/10 p-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright & Status */}
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-500 font-mono">
                © {year} Helm Inc. All rights reserved.
              </span>

              {/* System Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <CircleIcon
                  weight="fill"
                  className="text-green-500 animate-pulse"
                  size={8}
                />
                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">
                  Systems Normal
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white transition-all"
              >
                <TwitterLogoIcon size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white transition-all"
              >
                <InstagramLogoIcon size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white transition-all"
              >
                <LinkedinLogoIcon size={20} weight="fill" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
