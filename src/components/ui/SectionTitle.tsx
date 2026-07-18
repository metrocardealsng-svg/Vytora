interface Props{
title:string
subtitle?:string
center?:boolean
}

export default function SectionTitle({
title,
subtitle,
center=true
}:Props){

return(

<div className={`${center ? "text-center" : ""} mb-12`}>

<h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">

{title}

</h2>

{subtitle && (

<p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">

{subtitle}

</p>

)}

</div>

)

}
