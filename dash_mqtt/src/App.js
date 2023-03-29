import './App.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const {Account, Device, Services} = require('@tago-io/sdk'); 

    
    const notify = (message) => toast.success(message);
    const error = (message) => toast.error(message) 
    

function App() {
   const account = new Account({token:"191363cf-b92e-4700-8d9f-ca21d9e9783b"});
   const my_device = new Device({token:"1604825b-a5ea-4217-a359-3b0a1ce3232f"});

   const [arrayOfdevices,setArray] = useState([]);

    async function listdevices(){

         let list_response =  await account.analysis.list(); console.log(list_response)
         await account.analysis.run("642474606f1fa600090faf53")
         //await my_device.getVariablesData("6419c2dea997d700090c60ae",{qty: 20}).catch((err) => console.log(err) )
         const esn_variables = (await my_device.getData({ qty: 200 })).filter(obj => obj.variable === "esn")//a cada 100 variáveis eu tenho uma média de 16 variáveis ESN
         console.log(esn_variables)
       
       }

   
        window.TagoIO.onStart((widget) => {
            window.widget = widget;
        })
        window.TagoIO.ready();



        return(
             <div className="container">
                <ToastContainer />
                    <div className="box">
                        
                        <div className ="cabecalho">
                            <div className ="title">Enviar Comando</div>
                        </div>
                        
                        
                        <div className ="fieldOfSelection">
                
                            <div className=" label_dev">
                                <img className ="drop" alt='' src="https://img.icons8.com/external-zen-filled-royyan-wijaya/2x/external-list-dropdown-business-zen-filled-royyan-wijaya.png" />
                                <div className ="title_label">Select the device to configure it</div> 
                            </div>
                
                
                              <div className="input">
                                    <select id="devices" className ="devices">
                                    {arrayOfdevices.map((item) =>{
                                        try{
                                            return(
                                                <option value={`${item.id},${item.name}`}> {item.name} </option>
                                            )
                                        }catch(err){
                                           error(err)
                                        }
                                      
                                    })}
                                    </select>
                                </div>  
                                
                
                            
                
                            <div className="rodape">
                                 <button className="button" onClick={() => listdevices()}>
                                    Sent MQTT Message
                                </button> 
                            </div>
                
                
                        </div>
                        
                    
                
                    </div>  
                    
                   
                </div>
           
        )
}

export default App;