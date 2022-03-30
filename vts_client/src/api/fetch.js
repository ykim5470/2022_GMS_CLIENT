import axios from 'axios'

const fetchQuotes = async (apiConfig) => {
  try {
    return await axios.get(apiConfig.uri).then((resolve) => {
      if (resolve.status === 200) {
        console.log(`${resolve.status}: Create Room request success`)
        return resolve.data
      } else {
        console.log(`${resolve.status}: Create Room request failed`)
        return
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export default fetchQuotes
