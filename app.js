
let user = {}
let dapp = {}

async function connectMetamask() {
  try {
    const addresses = await ethereum.enable()
    user.address = addresses[0]
    const provider = new ethers.providers.Web3Provider(ethereum)
    let Contrat=new ethers.Contract(data.address, data.interface.abi, provider)
    let ContratSigner=Contrat.connect(provider.getSigner(user.address))

    dapp = { provider, Contrat, ContratSigner}

  } catch(err) {
    console.error(err);
  }
}
connectMetamask()


async function inscription(){
	var pseudo = document.getElementById('pseudo').value;
	var pass = document.getElementById('password').value;
	var passC = document.getElementById('confirmPassword').value;
	// Vérification d'un champs pseudo rempli, et d'une correspondance des mots de passe
    if((pass != passC)||(pseudo=="")||(pass == "")){
        alert("Vous avez oublié de remplir le pseudo, sinon les mots de passe ne correspondent pas");
    }
	else {
		// Vérification que l'adresse ethereum n'est pas déjà membre
		let estMembre = await dapp.ContratSigner.isMember();
		if(estMembre){
			let pseudoAdresse = await dapp.ContratSigner.getPseudo();
			console.log("Vous êtes déja membre "+pseudoAdresse+" utilisez plutôt le bouton d'authentification");
		}
		else {
			// Vérification de la disponibilité du pseudo
			let pseudoFree = await dapp.ContratSigner.isPseudoFree(pseudo);
			if(!pseudoFree){
				console.log("Ce pseudo est pris, veuillez en choisir un autre")			
			}
			else {
			// Inscription dans la blockchain et chargement de la page des principes
			await dapp.ContratSigner.sInscrire(pseudo)			
/*			console.log(keccak256(pass));
			await dapp.ContratSigner.setPassMember(keccak256(pass));
			let hashPass = await dapp.ContratSigner.getPassMember();
			console.log(keccak256(hashPass));
*/				
			window.location='./principes.html';
			}	
		}
	}
}

async function connexion() {
	var pseudo = document.getElementById('pseudo').value;
	var pass = document.getElementById('password').value;
	
	let estMembre = await dapp.ContratSigner.isMember();
	let pseudoAdresse = await dapp.ContratSigner.getPseudo();
	if (estMembre && (pseudoAdresse == pseudo) && pass!= "" ) {
		window.location='./principes.html';		
	}
}
	
var boutons = document.querySelectorAll('button');

for(i=0;i<boutons.length;i++){
	boutons[i].addEventListener('click', async function(b){
		// Enregistrement du principe dans la blockchain
		await dapp.ContratSigner.validerPrincipe(b.target.parentElement.innerHTML,b.target.id);
		userBalance();
	});	
}

async function userBalance () {
		let solde =	await dapp.ContratSigner.getTokens();
		
		baliseSolde = document.querySelector('#solde');
		baliseSolde.innerHTML = solde;
}