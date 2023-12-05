import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 bg-white w-full p-2 py-5 flex justify-between items-center">
        <p className="font-manrope text-xs">Copyright by IQPlayground, 2023</p>

        <ul className="flex h-full items-center gap-x-2">
            <li><Link to='/platform/terms' className="text-xs line-clamp-none font-inter tracking-tight">Terms</Link></li>
            <li><Link to='platform/policy' className="text-xs line-clamp-none font-inter tracking-tight">Privacy Policy</Link></li>
        </ul>
    </div>
  )
}
