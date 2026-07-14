import Link from "next/link";
import {  Play, Mail, Phone, MapPin, Heart, ChevronRight, MoveRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { P } from "./ui/typography";

export function Footers() {
  const currentYear = new Date().getFullYear();

  // Navigation links (these will be actual links)
  const navigateLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Donate", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  // Services (text only - no links)
  const servicesList = [
    "Cleft Surgery",
    "Orthodontics",
    "Speech Therapy",
    "Nutrition",
    "Psychosocial Support",
    "ENT Care",
  ];

  const contactInfo = [
    { icon: Phone, text: "+254 722 872 872", href: "tel:+254722872872" },
    { icon: Mail, text: "info@belarisumedicalcentre.org", href: "mailto:info@belarisumedicalcentre.org" },
    { icon: MapPin, text: "Park Road, Ngara, Nairobi, Kenya", href: "https://maps.google.com/?q=Park+Road+Ngara+Nairobi+Kenya" },
  ];

  const socialLinks = [
    { icon: Play, href: "https://facebook.com", label: "Facebook" },
    { icon: Play, href: "https://twitter.com", label: "Twitter" },
    { icon: Play, href: "https://instagram.com", label: "Instagram" },
    { icon: Play, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-primary-dark border-t border-gray-200 mt-auto">
    {/* Main Footer Content */}
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Logo Section */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-2">
              {/* Logo Image Placeholder - Replace with your actual logo */}
              <div className="w-10 h-10 border-primary-orange border-2 p-4 rounded-full flex items-center justify-center">
                <span className="text-primary-orange font-bold text-sm">BR</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  BelaRisu
                </h2>
                <p className="text-xs text-gray-400 font-medium">Medical Centre</p>
              </div>
            </div>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">
            A modern healthcare facility dedicated to restoring smiles and reimagining possibilities for children and adults across Africa through comprehensive cleft care.
          </p>
          {/* <div className="flex space-x-2 pt-2">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-gray-500 hover:text-primary-orange hover:bg-teal-50 transition-colors"
                
              >
                <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div> */}
          <Button className={"bg-primary-orange rounded-full p-5"}>
            <P>Support Our Mission</P>
            <MoveRightIcon className="w-4 h-4"/>
          </Button>
        </div>

        {/* Navigate Section - Links */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Navigate
          </h3>
          <ul className="space-y-2.5">
            {navigateLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-primary-orange transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Section - Text Only */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Services
          </h3>
          <ul className="space-y-2.5">
            {servicesList.map((service) => (
              <li key={service}>
                <span className="text-sm text-gray-500">
                  {service}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-6">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 text-sm text-gray-500 hover:text-primary-orange transition-colors group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-primary-orange flex-shrink-0 mt-0.5" />
                    <span className="break-words">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

 
        </div>
      </div>
    </div>

    <Separator className="bg-gray-200" />

    {/* Bottom Bar */}
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div className="text-center md:text-left">
          © {currentYear} BelaRisu Medical Centre. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/privacy-policy" className="hover:text-primary-orange transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-primary-orange transition-colors">
            Terms of Service
          </Link>
          <Link href="/sitemap" className="hover:text-primary-orange transition-colors">
            Sitemap
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <span>A</span>
          <span>
            <Link href="/foundation" className="font-medium text-primary-orange transition-colors">
              BelaRisu Foundation
            </Link>
            {" "}Initiative
          </span>
        </div>
      </div>
    </div>
  </footer>
  );
}