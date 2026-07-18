"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero3D() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#07120f] to-[#001d17]" />

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[180px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,#34e0a1_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="relative z-20 mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{ opacity:0,y:60 }}
            animate={{ opacity:1,y:0 }}
            transition={{ duration:1 }}
          >

            <div className="inline-flex rounded-full bg-emerald-400/10 px-5 py-2 text-sm text-emerald-300 border border-emerald-400/20">
              🇳🇬 Built for Africa
            </div>

            <h1 className="mt-8 text-6xl lg:text-7xl font-black leading-tight text-white">

              Move More.

              <br/>

              Live Better.

            </h1>

            <p className="mt-8 text-xl text-gray-300 max-w-xl">

              The smartest AI fitness tracker designed for Africa.

              Walk.

              Run.

              Sleep.

              Eat better.

              Become healthier.

            </p>

            <div className="mt-10 flex gap-4">

              <button className="rounded-full bg-emerald-400 px-8 py-4 font-bold text-black hover:scale-105 transition">

                Start Free

              </button>

              <button className="rounded-full border border-white/20 px-8 py-4 text-white">

                Watch Demo

              </button>

            </div>

            <div className="mt-10 flex items-center gap-3">

              <span className="text-yellow-400 text-xl">
                ★★★★★
              </span>

              <p className="text-gray-400">

                Loved by early Nigerian testers

              </p>

            </div>

          </motion.div>

          {/* Phone */}

          <motion.div

            animate={{
              y:[0,-15,0],
              rotate:[-2,2,-2]
            }}

            transition={{
              repeat:Infinity,
              duration:6
            }}

            className="relative mx-auto"

          >

            <div className="absolute inset-0 rounded-[50px] bg-emerald-400 blur-3xl opacity-30"/>

            <Image

              src="/images/vytora-phone.png"

              width={420}

              height={850}

              alt="Vytora"

              priority

            />

          </motion.div>

        </div>

      </div>

    </section>
);
}
