import { config} from 'dotenv';
config();
import fetch from 'node-fetch';

export default class ecoWatt{
constructor(){
  this.token = process.env.ECOTOKEN;
  this.access_token = null
}

  async login(){
    try{
      const res = await fetch('https://digital.iservices.rte-france.com/token/oauth/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${this.token}`
        },
        body: 'grant_type=client_credentials'
      });
      const data = await res.json();
      this.access_token = data.access_token;
    }catch(err){
      console.log(err);
    }
  }
    // fetch ecowatt data

    async getEcoWattData(){
      try {
        const res = await fetch('https://digital.iservices.rte-france.com/open_api/ecowatt/v4/signals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.access_token}`
          }
        });
      const data = await res.json();
      //console.log(data);
      return data;
      } catch (error) {
        console.log(error);
      }
    }
}