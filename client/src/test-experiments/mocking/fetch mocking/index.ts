export const getData = async (url: string) => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    // Normallly, I would not do the res.ok, check but it's used for the test example.
    if (!res.ok) {
      return {
        data: null,
        success: false,
        message: 'Request not successful. (1)'
      }
    }

    return {
      data: data,
      success: true,
      message: 'Request successful.'
    }
  } catch (_err) {
    return {
      data: null,
      success: false,
      message: 'Request not successful. (2)'
    }
  }
}
