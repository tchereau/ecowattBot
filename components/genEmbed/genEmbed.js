
let toTimestamp = (date) => {
  // convert 2022-06-06T00:00:00+02:00 to 1622956800
  return new Date(date).getTime() / 1000
}

let toDay = (date) => {
  // convert 2022-06-06T00:00:00+02:00 to lundi 6 juin 2022
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}


let genEmbed = (data) => {
  // generate embed object
  let ArBed = [];

  // pour chaque jour de la semaine générer un embed
  try{
    for (let i = 0; i < data.signals.length; i++) {
      const element = data.signals[i];
      let embed = {
        title: toDay(element.jour),
        description: element.message,
        color: element.dvalue == 1 ? 5832549 : element.dvalue == 2 ? 16734296 : 16745728,
        fields: []
      }
      for (let j = 0; j < element.values.length; j++) {
        const value = element.values[j];
        let field = {
          name: `${value.pas}h`,
          value: value.hvalue == 1 ? "Situation normale" : value.hvalue == 2 ? "Coupures d'électricité programmées" : "Risque de coupures d'électricité",
          "inline": true
        }
        embed.fields.push(field)
      }
      ArBed.push(embed)
    }
  }catch{
    console.log('error in genEmbed')
    return 0;
  }
  return ArBed;
}

export default genEmbed;