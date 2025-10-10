'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sansation } from "next/font/google"

const sansation = Sansation({ weight: "700", subsets: ["latin"], fallback: ["mono"] })

interface FeatureSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  reverse?: boolean;
}

export default function FeatureSection({
  id,
  title,
  subtitle,
  description,
  image,
  features,
  ctaText,
  ctaLink,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section
      id={id}
      className={`w-full py-20 px-6 md:px-16 lg:px-24 flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-12`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <h2 className={`${sansation.className} text-3xl md:text-4xl font-bold mb-4`}>{title}</h2>
        {subtitle && (
          <p className={`${sansation.className} text-xl text-indigo-500 font-medium mb-3`}>{subtitle}</p>
        )}
        <p className="mb-6">{description}</p>

        <ul className="space-y-2 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center">
              <span className="mr-2 text-indigo-500">✓</span>
              <span className="">{feature}</span>
            </li>
          ))}
        </ul>

        <Button asChild>
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="rounded-2xl shadow-lg object-cover w-full"
        />
      </motion.div>
    </section>
  );
}
