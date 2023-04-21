import { useState } from "react"

const ToAutocomplete = ({options, handleClickOptions, value, bollea, handleKey = (value) => {console.log(value)}}) => {



    return(
        <>
            {(options.length>0 && value.length<13) && bollea ?(
                <ul className="containerTocomplete">
                    {options.slice(0, 5).map((op) =>(
                        <li className='containerTextComplete' onClick={()=>{
                            handleClickOptions(op.value)
                            handleKey(op.description)
                            
                            }}>
                            <div className= 'textContainer'>
                                {op.value +' ' +op.description}
                            </div>

                        </li>
                    ))
                    }
                </ul>
            ):(
                <></>
            )
            }
        </>

    )

}



const InputAutoComplete = ({text, setText, width, options, name, setKey = (value) => { console.log(value)}}) =>{
    const [boolle, setBollea] = useState(true)
    const handleAction= (value) => {
        setText(value)
    }


  return(
      <div className='inputSpace' >
          <h3>{name + ' '}</h3>
          <input className='inputAutoCompleteP' style={{
            width: width+'px',
          }}
                 onChange={(e)=> {
                     setBollea(true)
                     setText(e.target.value)}}
                 value={text}
                 placeholder={name}
          >
          </input>
          <ToAutocomplete options={options} handleClickOptions={(value) => {
              setBollea(false)
              handleAction(value)}
            
            } value={text}
            bollea={boolle}
            handleKey={(value) => {setKey(value)}}
          ></ToAutocomplete>
      </div>
  )
}

export default InputAutoComplete