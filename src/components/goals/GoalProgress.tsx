"use client";

export default function GoalProgress({

current,

goal,

label

}:{

current:number

goal:number

label:string

}){

const percent=Math.min((current/goal)*100,100);

return(

<div className="mb-6">

<div className="flex justify-between">

<span className="text-white">

{label}

</span>

<span className="text-mint">

{current}/{goal}

</span>

</div>

<div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-800">

<div

style={{

width:`${percent}%`

}}

className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"

>

</div>

</div>

</div>

)

}
