import React from 'react'
import Navbar from '~/components/common/navbar'
import { auth } from '~/auth'
import { headers } from 'next/headers'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
		headers: await headers()
	})

  return (
    <div>
        <Navbar session={session} />
        {children}
    </div>
  )
}

export default Layout