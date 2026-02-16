"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import type { FaqItem } from "@/sanity/faq";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={`item-${item.id}`}
          className="border-white/10"
        >
          <AccordionTrigger className="text-left text-white hover:text-cyan-400 hover:no-underline py-5 text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-400 leading-relaxed">
            <div className="whitespace-pre-line">{item.answer}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
