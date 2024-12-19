import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
 import { useRouter } from 'next/navigation'
const page=async ()=> { 
    
    
    const session=await getServerSession(authOptions);
    console.log(session);
  if(session?.user){return (
    <h2 className='text-2xl'>
      welcome to admin {session?.user.username}
    </h2>
  )

  
}
return <h2>Please login to see tis admin page</h2>
}
export default page;
