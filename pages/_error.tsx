import { NextPageContext } from 'next'
import Error from 'next/error'

const CustomError = ({ statusCode }: { statusCode: string }) => (
  <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>
)

CustomError.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
