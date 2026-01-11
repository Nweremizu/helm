"use client";

import { motion, useMotionValue, useTransform } from "motion/react";

function useCardTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [12, -12]);
  const rotateY = useTransform(x, [-50, 50], [-12, 12]);

  function onMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

export default function Cards() {
  const spring = {
    type: "spring",
    stiffness: 180,
    damping: 22,
    mass: 0.8,
  };

  const cardHover = {
    scale: 1.04,
    transition: spring,
  };

  const tilt = useCardTilt();

  const cardVariants = (z = 0) => ({
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -12,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { ...spring, delay: z * 0.05 },
    },
  });

  return (
    <section className="bg-background dark:bg-background-dark py-32 relative overflow-hidden">
      {/* Background Pattern: Subtle Dot Grid (CSS generated) */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* --- Header Section --- */}
        <div className="mb-20">
          <span className="inline-block py-1 px-3 rounded-md bg-tertiary/20 text-primary font-bold tracking-widest text-xs mb-6 uppercase border border-tertiary/20">
            Smart Allocation
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-primary dark:text-white mb-6 uppercase leading-tight tracking-tight">
            Customize budgets for
            <br />
            <span className="relative inline-block">
              every lifestyle
              {/* Underline accent */}
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-tertiary/50 -skew-x-12"></div>
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re saving for a house, paying off debt, or planning
            a vacation, our flexible tools adapt to your unique financial
            journey.
          </p>
        </div>

        {/* --- The Visual: Interactive Wallet Stack --- */}
        <motion.div
          className="relative w-full max-w-md mx-auto h-100 flex justify-center items-center perspective-distant"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {/* CARD 1: Travel (Back) */}
          <motion.div
            // @ts-expect-error  types
            variants={cardVariants(0)}
            // @ts-expect-error  types
            whileHover={{
              y: -16,
              rotateZ: -22,
              transition: spring,
            }}
            className="absolute w-80 h-48 bg-gray-800 rounded-2xl -rotate-15 -translate-y-8 -translate-x-10"
          >
            <div className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Decorative World Map Lines (Simulated) */}
              <div className="absolute inset-0 opacity-10 border-2 border-dashed border-white rounded-2xl m-2"></div>

              <div className="flex justify-between items-start">
                <span className="text-white/50 text-xs font-mono tracking-widest">
                  TRAVEL FUND
                </span>
                <div className="w-8 h-5 bg-yellow-500/20 rounded"></div>{" "}
                {/* Fake Chip */}
              </div>
              <div className="text-right">
                <span className="text-white font-bold text-lg tracking-widest">
                  ✈️ NYC 2024
                </span>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: Home (Middle) */}
          <motion.div
            // @ts-expect-error  types
            variants={cardVariants(1)}
            // @ts-expect-error  types
            whileHover={{
              y: -12,
              rotateZ: -10,
              transition: spring,
            }}
            className="absolute w-80 h-48 bg-primary rounded-2xl -rotate-[5deg] -translate-y-4 -translate-x-2.5 z-10"
          >
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="w-6 h-6 rounded-full bg-white/40 -ml-3"></div>
                </div>
                <span className="text-white/80 font-mono text-sm">
                  **** 8842
                </span>
              </div>
              <div>
                <span className="block text-white/60 text-xs uppercase font-bold mb-1">
                  Savings Goal
                </span>
                <span className="text-white font-bold text-2xl tracking-tight">
                  Home Deposit
                </span>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: Emergency (Front) */}
          <motion.div
            // @ts-expect-error  types
            variants={cardVariants(2)}
            // @ts-expect-error  types
            whileHover={cardHover}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={{
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transformStyle: "preserve-3d",
            }}
            className="absolute w-80 h-48 bg-secondary rounded-2xl rotate-6 translate-y-4 translate-x-5 z-20 shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
          >
            {/* Glossy sheen effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="p-6 h-full flex flex-col justify-between relative">
              <div className="flex justify-between items-start">
                {/* EMV Chip */}
                <div className="w-10 h-8 bg-yellow-200 rounded-md relative border border-yellow-300 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-px bg-yellow-400"></div>
                  <div className="w-px z-10 h-full bg-yellow-400 absolute left-[24%]"></div>
                  <div className="w-px z-10 h-full bg-yellow-400 absolute left-[76%]"></div>
                </div>
                <span className="text-primary font-bold tracking-widest uppercase text-xs border border-primary/20 px-2 py-1 rounded">
                  Emergency
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="font-mono text-primary text-lg tracking-widest">
                  $12,450
                </div>
                <div className="text-primary/50 text-xs font-bold uppercase">
                  Liquid Cash
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge (Replaces the bouncing $) */}
          <div className="absolute -left-4 top-1/4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-bounce delay-700 z-30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                +
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Interest
                </p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  4.5% APY
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
