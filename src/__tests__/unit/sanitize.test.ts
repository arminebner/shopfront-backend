import { describe, expect, test } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import sanitize from '../../middleware/sanitize'
import sinon from 'sinon'

describe('sanitize middleware', () => {
  test('should sanitize req.body, req.query, and req.params', () => {
    const req: Request = {
      body: {
        name: '<script>alert("XSS attack!")</script>',
      },
      query: {
        search: '<script>alert("XSS attack!")</script>',
      },
      params: {
        id: '<script>alert("XSS attack!")</script>',
      },
    } as unknown as Request
    const res: Response = {} as Response
    const next: NextFunction = sinon.spy()

    sanitize(req, res, next)

    expect(req.body.name).toEqual('&lt;script&gt;alert("XSS attack!")&lt;/script&gt;')
    expect(req.query.search).to.equal('&lt;script&gt;alert("XSS attack!")&lt;/script&gt;')
    expect(req.params.id).to.equal('&lt;script&gt;alert("XSS attack!")&lt;/script&gt;')
    expect(next).toHaveBeenCalled
  })
})
