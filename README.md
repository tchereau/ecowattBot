# écoWatt Bot

écoWatt est un site/application Française créer par la RTE afin d'avertir des risques de coupure de courant durant l'hiver 2022.

leur api étant opensource, ce petit bot est là afin d'afficher toutes les 30 min un simple tableau des jours et des heures avec la situation prévue (situation normale, risque de coupure, coupure prévue)

## Installation

Pour commencer, il vous faut un token discord, vous pouvez en créer un [ici](https://discord.com/developers/applications)
Ainsi qu'un token api, vous pouvez en créer un [ici](https://data.rte-france.com/catalog/-/api/consumption/Ecowatt/v4.0) sur le site de la RTE en vous connectant avec votre compte et créant une application.

Une fois ces deux tokens en main, il vous suffit de créer un fichier .env à la racine du projet et de le remplir comme ceci (vous pouvez aussi renommer le fichier .env.example en .env et le remplir):

```bash
DSTOKEN = ""
ECOTOKEN = ""
PREFIX = "eco!"
```

Ensuite, il vous suffit de lancer le bot avec la commande suivante :

```bash
npm start
```
ou bien avec forever
```bash
forever start index.js
```

## Commandes

- eco!help : affiche l'aide.
- eco!ecowatt : affiche le tableau des jours et des heures avec la situation prévue (situation normale, risque de coupure, coupure prévue).
- eco!addchannel : ajoute le channel dans la liste des channels où le bot enverra le tableau des jours et des heures avec la situation prévue.
- eco!removechannel : supprime le channel de la liste des channels où le bot envoie le tableau des jours et des heures avec la situation prévue.

## License

C'est opensource, ne vous gênez pas pour le modifier et l'améliorer (juste mentionnez moi dans le readme, si vous le faites ça serait cool ![:hap:](https://cdn.discordapp.com/emojis/1021165473406132245.png))

