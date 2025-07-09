// import { sleep } from 'utils'

const randomFail = (): boolean => {
  return Math.random() < 0.35
}

/* ======================
      fetchPeople()
====================== */

export const fetchPeople = async (url: string, page: number) => {
  const urlWithPage = `${url}/?page=${page}`

  // await sleep(1500)

  const shouldFail = randomFail()
  if (shouldFail) {
    return {
      data: null,
      count: null,
      nextURL: null,
      prevURL: null,
      prevPage: null,
      currentPage: null,
      nextPage: null,
      isNext: false,
      isPrev: false,
      message: 'Random fail.',
      success: false
    }
  }

  try {
    const res = await fetch(urlWithPage)
    const data: any = await res.json()

    const { count, next, previous, results } = data
    const prevPage = previous ? page - 1 : null
    const nextPage = next ? page + 1 : null

    const isNext = next ? true : false
    const isPrev = previous ? true : false

    return {
      data: results,
      count: count,
      nextURL: next,
      prevURL: previous,
      prevPage: prevPage,
      currentPage: page,
      nextPage: nextPage,
      isNext: isNext,
      isPrev: isPrev,
      message: 'Success',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      count: null,
      nextURL: null,
      prevURL: null,
      prevPage: null,
      currentPage: null,
      nextPage: null,
      isNext: false,
      isPrev: false,
      message: 'Request failed.',
      success: false
    }
  }
}
