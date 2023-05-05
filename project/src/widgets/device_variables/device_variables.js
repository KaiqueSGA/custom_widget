import './device_variables.css';
import React, { useEffect, useState } from 'react';


const { tago_device } = require('../../classes/device/device.js');
const { location_apis } = require('../../classes/location/location.js')


function Device_variables(){
  const [device_variables, set_device_variables] = useState([]);

  const device_methods = new tago_device();
  const location_funcs = new location_apis();


   useEffect(() => {
    window.TagoIO.onStart( async(widget) => {
      window.widget = widget;

      let device_id = widget.display.variables[0].origin.id;
      let request = await device_methods.get_device_variables(device_id); 
       console.log(request.filter((x) => x.metadata.media === "STX").length)
      set_device_variables(request.filter((x) => x.metadata.media === "STX"));
  })
  window.TagoIO.ready(); 
  },[]) 




  

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
                                <td>link</td>
                                <td>Date and Time</td>
                                <td>Coordinates</td>
                                  
                            </tr>
                            {device_variables.map(data => { 

                               

                                  const hex_2_bin = (hexadecimal_content) => {
                                    return ("00000000" + parseInt(hexadecimal_content, 16).toString(2)).substr(-8);
                                  };

                                 const catch_payload = (stu_message) => {
                                    //This function is catching the hexadecimal message sent by device
                                    let firstTag = stu_message.indexOf(">", stu_message.indexOf("<payload"));
                                    let secondTag = stu_message.indexOf("</payload>", firstTag);
                                
                                    return stu_message.substring(firstTag + 3, secondTag);
                                  };
                                
                                  
                                  const decode_lat = (file_content, cardinal_position) => {
                                    let hexadecimal_lat = file_content.substring(0, 6);
                                    let integer_lat = String(parseInt(hexadecimal_lat, 16)); //estou convertendo para inteiro um valor hexa, por isso eu coloco o 16 como parâmetro
                                     
                                    let final_lat = integer_lat / 10_000; 
                                    let ready_coordinate = cardinal_position === "south"
                                                                                      ? "-" + String(final_lat.toFixed(8))
                                                                                      : String(final_lat.toFixed(8));
                                
                                    return ready_coordinate; 
                                  };
                                
 
                                  const decode_lng = (file_content, cardinal_position) => {
                                    let hexadecimal_lng = file_content.substring(6, 12);
                                    let integer_lng = parseInt(hexadecimal_lng, 16);
                                
                                    let final_lng = integer_lng / 10_000; 
                                    let ready_coordinate = cardinal_position === "weast"
                                                                                     ? "-" + String(final_lng.toFixed(8))
                                                                                     : String(final_lng.toFixed(8));
                                
                                    return ready_coordinate; 
                                  };


                                  const decode_binary_values = (payload) => {
                                    let values_object = new Object();
                                    let binary = hex_2_bin(payload.substring(12, 14));

                                    let value_of_each_byte = {
                                      0: (byte) => { byte === "0"   ?values_object.cardinal_position_s_n = "south"    :values_object.cardinal_position_s_n = "north"; },
                                      1: (byte) => { byte === "0"   ?values_object.cardinal_position_w_e = "weast"    :values_object.cardinal_position_w_e = "east";},
                                      2: (byte) => { byte === "0"   ?values_object.origin = "GPS"                     :values_object.origin = "GPS-DR";},
                                      3: (byte) => { byte === "0"   ?values_object.mode = 2                           :values_object.mode = 3; },
                                    };

                                    for (let i = 0; i <= 3; i++) { value_of_each_byte[String(i)](binary[i]); }//i --> binary position / binary[i] --> binary value

                                    return values_object;
                                  }


                                  let payload = catch_payload(data.metadata.xml);
                                  let bin_values_decoded = decode_binary_values(payload);

                                  let latitude = Number(decode_lat(payload, bin_values_decoded.cardinal_position_s_n));
                                  let longitude = Number(decode_lng(payload, bin_values_decoded.cardinal_position_w_e));

                                  var link = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                                
                            
                              return( 
                                <tr>
                                    <td className='data_variable'>{data.metadata.origin}</td>

                                     <td>{String(data.time)}</td>  

                                    <td className='b'><a href={link} target="_blank"> Google link</a></td>

                                     <td className={data.id}></td>{/* Date and time */}
                                     <td className={data.id}></td>{/* Coordinates */}

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