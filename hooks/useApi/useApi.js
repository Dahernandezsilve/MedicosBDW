import {useState} from 'react'

const useApi = () => {
  const [response, setResponse] = useState({})
  const [loading, setLoading] = useState(false)
  const handleRequest = async (method, path, body = '') => {
    setLoading(true)
    //fetch
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (method!== 'GET'){
      options.body = JSON.stringify(body)
    }

    console.log('method', method)
    const fetchResponse = await fetch(`http://52.14.44.33/api${path}`, options)
    const JSONresponse = await fetchResponse.json()

    setResponse(JSONresponse)
    console.log('response', response)
    setLoading(false)
  }

  return [response, loading, handleRequest]
}

export default useApi
