import './device_variables.css';
import React, { useEffect, useState } from 'react';


const { tago_device } = require('../../classes/device/device.js');
const { location_apis } = require('../../classes/location/location.js')


function Device_variables(){
  const [device_variables, set_device_variables] = useState( [] );

  const device_methods = new tago_device();
  const location_funcs = new location_apis();


  /* useEffect(() => {console.log("oiii")
    window.TagoIO.onStart( async(widget) => {
      window.widget = widget;

      let device_id = widget.display.variables[0].origin.id;
      let request = await device_methods.get_device_variables(device_id).filter(data => data.metadata.media === "STX"); 
      set_device_variables(request); 
  })
  window.TagoIO.ready(); 
  },[]) */
useEffect(() => {
   device_methods.get_device_variables("6419c2dea997d700090c60ae")
     .then((data) => {console.log(data)
        set_device_variables(data.filter(data => data.metadata.media === "STX"))
     })
   
},[])



    const cacthESN = (data) =>{
      let help = data.indexOf("<unixTime>");
      let firstTag = data.indexOf(">",help);
      let secondTag = data.indexOf("</unixTime>",firstTag);
    
      return data.substring(firstTag + 1,secondTag)
    }
  


    
   


   function add_0_to_left(value){

      if( String(value).length === 1 ){
        return "0" + value;
      }else{
        return value;
      }

   }



    return(
        <>

        <div className='div-mother'>
        <div className='div-filho'>

      <div className='text-div-mother'>
         <h1>See all variables that the selected device sent!</h1>
         <br/>
        </div>
       
                <div className='data_variables'>

                        <table border="1" className='variable_tables'>
                            <tr>
                                <td>TimeStamp Value</td>
                                <td>UnixTime Value</td>
                                <td>Difference between Dates</td>
                                  
                            </tr>
                            {device_variables.map(data => { 

                            
                            let unixTime = new Date( (Number( cacthESN(data.metadata.xml) )) * 1000); 

                            console.log(unixTime.getSeconds() - data.time.getSeconds());
                            console.log();
                            console.log(" ");
                              return( 
                                <tr>

                                      <td>{`${ add_0_to_left((data.time.getMonth()) + 1)  }/${ add_0_to_left(data.time.getDate()) }/${ add_0_to_left(data.time.getFullYear()) } ${ add_0_to_left(data.time.getHours()) }:${ add_0_to_left(data.time.getMinutes()) }:${ add_0_to_left(data.time.getSeconds()) }`}</td>   

                                      <td className='data_variable'>{`${ add_0_to_left((unixTime.getMonth()) + 1)  }/${ add_0_to_left(unixTime.getDate()) }/${ add_0_to_left(unixTime.getFullYear()) } ${ add_0_to_left(unixTime.getHours()) }:${ add_0_to_left(unixTime.getMinutes()) }:${ add_0_to_left(unixTime.getSeconds()) }`}</td> 

                                      <td className='b'>{ `The values has a difference of: ${Math.abs(unixTime.getHours() - data.time.getHours() )} hours,  ${(Math.abs( ( (unixTime.getMinutes() * 60) - (data.time.getMinutes()) * 60) / 60) )} minutes and  ${Math.abs(unixTime.getSeconds() - data.time.getSeconds())} seconds of unixtime` }</td>

                                     <td className={data.id}></td>
                                     <td className={data.id}></td>

                                </tr>
                              )

                               
  


                            })}

                        </table>
                        
                            
                    
                </div>




                </div> 


           

            </div>         
         
        </>
    )
}



export { Device_variables };