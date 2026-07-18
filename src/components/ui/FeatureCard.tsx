interface Props{

icon:string

title:string

body:string

}

export default function FeatureCard({

icon,

title,

body

}:Props){

return(

<div className="glass rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(52,224,161,0.18)]">

<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint to-teal flex items-center justify-center text-2xl">

{icon}

</div>

<h3 className="mt-6 text-xl font-bold text-white">

{title}

</h3>

<p className="mt-3 text-slate-400 leading-relaxed">

{body}

</p>

</div>

)

}
