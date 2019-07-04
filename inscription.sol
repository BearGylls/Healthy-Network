	pragma solidity ^0.5.8;
contract Inscription {

    struct Principe {
        uint id;
        uint poids;
        bool valide;
        uint nbJoursConsecutifs;
        uint nbMoisEnCours;
        uint nbAnneeEnCours;
    }
    mapping (string => address) adressMembre;
    mapping (address => string) Pseudo;
    mapping (address => bool) estMembre;
    mapping (address => mapping (string => Principe)) principeValide;
    mapping (address => uint) soldeTokens;
    mapping (address => bytes32) hashMotDePasse;
    uint[]  poidsPrincipes=[1,2,3,4];

    
    function sInscrire(string memory _pseudo) public returns (string memory) {
        require(!estMembre[msg.sender]);
        adressMembre[_pseudo]=msg.sender;
        Pseudo[msg.sender]=_pseudo;
        estMembre[msg.sender]=true;
    }
    
    function validerPrincipe(string memory _principe, uint _idPrincipe) public returns(uint){
        principeValide[msg.sender][_principe].valide = true;
        soldeTokens[msg.sender] += poidsPrincipes[_idPrincipe-1];
        
        return soldeTokens[msg.sender];
    }

    function isMember()public view returns(bool) {
       return estMembre[msg.sender];         
    }

    function getPseudo() public view returns(string memory){
        return Pseudo[msg.sender];
    }
    
    function getTokens() public view returns(uint){
			return soldeTokens[msg.sender];    
    }

	 function isPseudoFree(string memory _pseudo) public view returns(bool){
	 	if(adressMembre[_pseudo]== 0x0000000000000000000000000000000000000000){
			return true;	 	
	 	}
	 	else{
	 		return false;	 	
	 	}
	 }
	 
    function getPrincipe(string memory _principe) public view returns (bool){
        return principeValide[msg.sender][_principe].valide;
    }

	function setPassMember(bytes32 _passMember) public {
		hashMotDePasse[msg.sender] = _passMember;	
	}
	
	function getPassMember() public view returns(bytes32){
		return hashMotDePasse[msg.sender];	
	}
}
