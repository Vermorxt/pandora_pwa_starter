import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import scss from './breadcrumbs.module.scss'

export interface BreadcrumbInterface {
  breadcrumb: string
  href?: string
}

export const firstCharUppercase = (breadcrumbString: string) => {
  const containingDashLength = breadcrumbString?.replace(/[^-]/g, '').length

  return containingDashLength <= 3
    ? breadcrumbString.charAt(0).toUpperCase() + breadcrumbString.slice(1)
    : breadcrumbString
}

export const setPathArray = (router: NextRouter) => {
  const linkPath = router.asPath.split('/')

  linkPath.shift()

  return linkPath.map((path, i) => ({
    breadcrumb: path,
    href: '/' + linkPath.slice(0, i + 1).join('/'),
  }))
}

export const renderListItems = (breadcrumbs: BreadcrumbInterface[]) =>
  breadcrumbs.map((breadcrumb: BreadcrumbInterface, i) => (
    <li key={breadcrumb.href} className={scss.breadcrumb_item}>
      <>
        <Link href={breadcrumb?.href as string} className={scss.active}>
          {breadcrumb.breadcrumb}
        </Link>
      </>
    </li>
  ))

export const Breadcrumbs = () => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbInterface[]>([])

  useEffect(() => {
    if (router) {
      setBreadcrumbs(setPathArray(router))
    }
  }, [router])

  return (
    <nav aria-label="breadcrumbs" className={`${scss.breadcrumbs_nav} text-sm breadcrumbs pl-8 text-base-content`}>
      <ul className={scss.breadcrumbs}>
        <li className={scss.breadcrumb_item}>
          <a href={'/'} className={scss.active}>
            <p>Home</p>
          </a>
        </li>
        {renderListItems(breadcrumbs)}
      </ul>
    </nav>
  )
}
