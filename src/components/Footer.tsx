export default function Footer () {
    return (
        <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
            <div className="border-t border-slate-900/5 py-10">
                <p className="flex items-center justify-center font-bold text-2xl text-red-500">Shrnk</p>
                <p className="mt-5 text-center text-sm leading-6 text-slate-500">© 2022 <span>Shrnk</span>. All rights reserved.</p>
                <div className="flex items-center justify-center my-2">
                    <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                        <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </span>
                        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                            <span>
                                <a target="_" href="https://x.com/Sarthak10007">@sarthak`s twitter</a>                                
                            </span>
                            <svg
                            fill="none"
                            height="16"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M10.75 8.75L14.25 12L10.75 15.25"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            />
                            </svg>
                        </div>
                        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                </div>
            </div>
        </footer>
    )
}