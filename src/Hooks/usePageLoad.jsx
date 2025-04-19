import {useState, useEffect} from 'react'

const usePageLoad = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>
    {
      window.addEventListener('load', function (){
        setIsLoading(false);

      })

      // this would help clean u the code
      return ()=> {
        window.removeEventListener('load', function(){
          setIsLoading(false);
        })
      }
    }, [])
  return isLoading;
}

export default usePageLoad