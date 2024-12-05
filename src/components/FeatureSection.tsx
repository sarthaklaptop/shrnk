import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Built for Innovators",
      description:
        "Empowering developers, engineers, and entrepreneurs to create, analyze, and grow effortlessly.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Lightning-Fast Link Shortening",
      description:
        "Shorten URLs instantly with optimized performance designed to handle high traffic with ease.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Advanced Analytics Dashboard",
      description:
        "Track clicks, traffic sources, and user behavior in real-time with actionable insights at your fingertips.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Flexible & Transparent Pricing",
      description:
        "No hidden fees. No credit card required. Get the best features at the best value, always.",
      icon: <IconCloud />,
    },
    {
      title: "Unbreakable Uptime",
      description:
        "With a 100% uptime guarantee, your links stay live and accessible 24/7 without fail.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Seamless Team Collaboration",
      description:
        "Share access without sharing passwords, all thanks to our multi-tenant architecture.",
      icon: <IconHelp />,
    },
    {
      title: "24/7 AI-Powered Support",
      description:
        "Shrnk offers 24/7 dedicated customer support, ensuring reliable assistance whenever you need it—no AI, just real people ready to help.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Risk-Free Experience",
      description:
        "Not satisfied? Our money-back guarantee ensures peace of mind while we work to exceed expectations.",
      icon: <IconHeart />,
    },
  ];
  return (
    <div
      id="features-section"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto"
    >
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
