"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AchievementPopup({
show,
title
}:{
show:boolean
title:string
}){

return(

<AnimatePresence>

{show && (

<motion.div

initial={{opacity:0,scale:0}}

animate={{
opacity:1,
scale:1,
rotate:[0,-8,8,-8,8,0]
}}

exit={{opacity:0,scale:0}}

transition={{duration:.8}}

className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999]"
>

<div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-8 shadow-[0_0_80px_rgba(255,220,80,.8)]">

<div className="text-6xl text-center">
🏆
</div>

<h2 className="mt-4 text-center text-2xl font-black text-black">
Achievement Unlocked
</h2>

<p className="mt-2 text-center font-semibold text-black">
{title}
</p>

</div>

</motion.div>

)}

</AnimatePresence>

)

}
