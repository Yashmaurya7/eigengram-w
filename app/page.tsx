import { buttonVariants } from "@/components/ui/button";

import Link from "next/link";

export default async function Home() {
 
  return <div>
    <h1 className='text-4xl'>Home</h1>
    <Link className ={buttonVariants()} href='/dashboard'>Open my dashboard</Link>
    
  </div>;
}
