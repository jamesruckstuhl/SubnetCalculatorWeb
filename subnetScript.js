/*
Author: James Ruckstuhl
Date Last Modified: Monday December 22nd, 2014
Program Description: This Javascript file is used to calculate subnet information (Network Class (only for classful IP address),Subnet mask,CIDR,Network Address,Broadcast Address,Bits in host,Bits in Network)  
for default classful IP addresses,an IP with a VLSM, and IP addresses with dotted decimal subnet masks 

Contains a parse() function to handle input, and based on the type of input calls the appropriate function to calculate the information.
Contains a function SubnetInformation with inner functions to simulate a class (calculateClassfullAddressInfo(), calculateVLSMInfo(), calculateDottedDecimalInfo())
and attributes networkClass, subnetMask, cidr, networkAddress, broadcastAddress, bitsInHost, and bitsInNetwork
*/

//Create object subnetInformation to represent calculated subnet information
var subnetInformation = new SubnetInformation();

//Description: Driver function to handle input in index.html
//Prerequisites: None
//Outcomes: Program Execution
//Calls: all functions of SubnetInformation Class
//Called by: index.html
function parse()
{
     document.getElementsByName('output')[0].value = "";
	 var tokenizedInput = document.getElementById("input").value.split(" ");
	 
	 //If no input is entered
	 if(tokenizedInput.length <= 0)
	 {
	    console.log("in no input section");
		document.getElementsByName('output').value.value = "Please provide input";
	 }

	 //If 1 token is entered, check if you have an IP, or an IP with a CIDR specified netmask
     else if(tokenizedInput.length == 1)
	 {
		var token = tokenizedInput[0];
		var tokenizeSingleInputLength;
		try
		{
			var tokenizeSingleInput = token.split("/");
			tokenizeSingleInputLength = tokenizeSingleInput.length;
		}
		catch(err)
		{
			tokenizeSingleInputLength = 1;
		}
		
		//Check to see if user entered in an IP with a VLSM by parsing on /
		if(tokenizeSingleInputLength == 2)
		{
			var ipAddress = tokenizeSingleInput[0];
			var vlsmValid = true;
			if(subnetInformation.validateIPAddress(ipAddress))
			{
				var vlsm = 0;
				try
				{
					vlsm = parseInt(tokenizeSingleInput[1],10);
				}
				catch(err)
				{
					document.getElementById("output")[0].value = "Input is invalid, Please see instructions";
					vlsmValid = false;
				}
				if(subnetInformation.validateVLSM(vlsm) && vlsmValid)
				{
					subnetInformation.calculateVLSMInfo(ipAddress,vlsm)
					var textAreaText = '';
					textAreaText = "";
					textAreaText += "Subnet Mask: " + subnetInformation.subnetMask + "\n";
					textAreaText += "CIDR: " + subnetInformation.cidr + "\n";
					textAreaText += "Hosts per subnet: " + subnetInformation.hostsPerSubnet + "\n";
					textAreaText += "Network Address: " + subnetInformation.networkAddress + "\n";
					textAreaText += "Broadcast Address: " + subnetInformation.broadcastAddress + "\n";
					textAreaText += "Bits in Host: " + subnetInformation.bitsInHost + "\n";
					textAreaText += "Bits in Network: " + subnetInformation.bitsInNetwork + "\n";
					document.getElementsByName('output')[0].value = textAreaText;
				}
			
				else
				{
					document.getElementsByName('output')[0].value = "Input is invalid. Please see instructions";
				}
			}
			else
			{	
				document.getElementsByName('output').value.value = "Input is invalid. Please see instructions";
			}
		}
		//User didn't enter IP with VLSM, check validity of token and handle
		else 
		{
			if(subnetInformation.validateIPAddress(token))
			{
				var textAreaText = '';
				subnetInformation.calculateClassfullAddressInfo(token);
				textAreaText += 'Network Class: ' + subnetInformation.networkClass + '\n'
				
				if(!(subnetInformation.networkClass == 'E' || subnetInformation.networkClass == 'D'))
				{
					textAreaText += 'Subnet Mask: ' + subnetInformation.subnetMask + '\n';
					textAreaText += 'CIDR: ' + subnetInformation.cidr + '\n';
					textAreaText += 'Hosts per subnet: ' + subnetInformation.hostsPerSubnet + '\n';
					textAreaText += "Network Address: " + subnetInformation.networkAddress + "\n";
					textAreaText += "Broadcast Address: " + subnetInformation.broadcastAddress + "\n";
					textAreaText += "Bits in Host: " + subnetInformation.bitsInHost + "\n";
					textAreaText += "Bits in Network: " + subnetInformation.bitsInNetwork + "\n";
				}
				
				else 
				{
					textAreaText += "Subnet Mask: Undefined\n";
					textAreaText += "CIDR: Undefined\n";
					textAreaText += "Hosts per subnet: Undefined\n";
					textAreaText += "Network Address: Undefined\n";
					textAreaText += "Broadcast Address: Undefined\n";
					textAreaText += "Bits in Host: Undefined\n";
					textAreaText += "Bits in Network: Undefined\n";
				}
				document.getElementsByName('output')[0].value = textAreaText;
			}
			
			else
			{
				document.getElementsByName('output')[0].value = "Input is invalid. Please see instructions";
			}
		}
	 }

	 //If 2 tokens are entered, check if you have an IP and a dotted decimal netmask
	 else if(tokenizedInput.length == 2)
	 {
		var textAreaText = '';
		var ipAddress = tokenizedInput[0];
		var dottedDecimalSubnetMask = tokenizedInput[1];
		
		if(subnetInformation.validateIPAddress(ipAddress) && !subnetInformation.validateDottedDecimalSubnetMask(dottedDecimalSubnetMask) == "")
		{
			subnetInformation.calculateDottedDecimalInfo(ipAddress, dottedDecimalSubnetMask);
			textAreaText += 'Subnet Mask: ' + subnetInformation.subnetMask + '\n';
			textAreaText += 'CIDR: ' + subnetInformation.cidr + '\n';
			textAreaText += 'Hosts per subnet: ' + subnetInformation.hostsPerSubnet + '\n';
			textAreaText += "Network Address: " + subnetInformation.networkAddress + "\n";
			textAreaText += "Broadcast Address: " + subnetInformation.broadcastAddress + "\n";
			textAreaText += "Bits in Host: " + subnetInformation.bitsInHost + "\n";
			textAreaText += "Bits in Network: " + subnetInformation.bitsInNetwork + "\n";
			document.getElementsByName('output')[0].value = textAreaText;
		}
		
		else
		{
			document.getElementsByName('output')[0].value += "Input is invalid. Please see instructions";
		}
	 
	 }

	 //If 3 tokens are entered
	 else if(tokenizedInput.length == 3)
	 {
		document.getElementsByName('output')[0].value += "Input is invalid. Please see instructions";
	 }
}

//Description: Represents all calculated subnet information.Contains functions to calculate subnet information (See top of page for detailed description)
//Prerequisites: Object of this function must be instantiated in order to use inner functions
//Outcomes: Calculate subnet information
//Calls: Inner utility functions validateVLSM(),validateDottedDecimalSubnetMask(), and formatString()
//Called By: First code statement at beginning of file
function SubnetInformation()
{
    //Create attributes of SubnetInformation()
	this.ipAddress;
	this.networkClass;
	this.subnetMask;
	this.cidr;
	this.hostsPerSubnet;
	this.broadcastAddress;
	this.bitsInHost;
	this.bitsInNetwork;
	this.networkAddress = "";
	
	//Description: Calculates subnet information for a classful IP address
	//Prerequisites: ipAddress must have a valid value
	//Outcomes: Calculates subnet information
	//Calls: None
	//Called by:object subnetInformation in function parse()
	this.calculateClassfullAddressInfo = function(ipAddress)
	{
	  //If statements to calculate subnet information based on first octet (which gives network class)
	  var octets = ipAddress.split(".");
	  if(parseInt(octets[0],10)<= 127)
	  {
		 this.networkClass = "A";
		 this.subnetMask = "255.0.0.0";
		 this.cidr = "/8";
		 this.hostsPerSubnet = "16777214";
		 this.networkAddress = octets[0] + "." + "0" + "." + "0" + "." + "0";
		 this.broadcastAddress = octets[0] + ".255.255.255";
		 this.bitsInHost = "24";
		 this.bitsInNetwork = "8";
	  }
	  
	  else if(parseInt(octets[0],10)<= 191)
	  {
		 this.networkClass = "B";
		 this.subnetMask = "255.255.0.0";
		 this.cidr = "/16";
		 this.hostsPerSubnet = "65534";
		 this.networkAddress = octets[0] + "." + octets[1] + "." + "0" + "." + "0";
		 this.broadcastAddress = octets[0] + "." + octets[1] + ".255.255";
		 this.bitsInHost = "16";
		 this.bitsInNetwork = "16";
	  }
	  
	  else if(parseInt(octets[0],10)<=223)
	  {
		 this.networkClass = "C";
		 this.subnetMask = "255.255.255.0";
		 this.cidr = "/24";
		 this.hostsPerSubnet = "254";
		 this.networkAddress = octets[0] + "." + octets[1] + "." + octets[2] + "." + "0";
		 this.broadcastAddress = octets[0] + "." + octets[1] + "." + octets[2] + ".255";
		 this.bitsInHost = "8";
		 this.bitsInNetwork = "24";
	  }
	  
	  else if(parseInt(octets[0],10) <= 239)
	  {
		this.networkClass = "D";
	  }
	  
	  else
	  {
		this.networkClass = "E";
	  }
	}
	
	//Description: Calculates subnet information for an IP address with a VLSM
	//Prerequisites: ipAddress and vlsm must have valid values
	//Outcomes: Calculates subnet information
	//Calls: none
	//Called by:object subnetInformation in function parse()
	this.calculateVLSMInfo = function(ipAddress, vlsm)
	{
		var tempSubnetMask = "";
		var networkAddressBinaryString = "";
		var broadcastAddressBinaryString = "";
		this.cidr = "/" + vlsm;
		
		//Calculate Hosts per subnet
		if(vlsm <= 30)
		{
			this.hostsPerSubnet = Math.pow(2,(32-vlsm))-2 + "";
		}
		
		else
		{
			this.hostsPerSubnet = Math.pow(2,32-vlsm) + "";
		}
		this.bitsInNetwork = vlsm;
		this.bitsInHost = 32-vlsm;
		
		//Calculate Subnet Mask
		for(i = 0; i < vlsm; i++)
		{
			if(i == 0)
			{
				tempSubnetMask = "1";
			}
			
			else
			{
				tempSubnetMask = tempSubnetMask + "1";
			}
		}
		
		for(i = 0; i <(32-vlsm);i++)
		{
			tempSubnetMask = tempSubnetMask + "0";
		}
		//Calculate Network Address
		octets = ipAddress.split(".");
		var substringBase = 0;
		for(i = 0; i<4; i++)
		{
			var temp = parseInt(tempSubnetMask.substring(substringBase,substringBase + 8),2);
			console.log("temp" + i + " " + temp);
			var netAddressPart = temp & parseInt(octets[i],10);
			console.log("testing parsing" + parseInt(octets[i]));
			this.networkAddress += netAddressPart;
			networkAddressBinaryString += subnetInformation.formatString(parseInt(netAddressPart,2),8,"0");
			if(i != 3)
			{
				this.networkAddress += ".";
			}
			substringBase += 8;
		}
		
		//Calculate Broadcast Address
		for(i = 0; i<32; i++)
		{
			if(i<vlsm)
			{
				broadcastAddressBinaryString += networkAddressBinaryString.charAt(i);
			}
			else
			{
				broadcastAddressBinaryString += "1";
			}
		}
		this.subnetMask = parseInt(tempSubnetMask.substring(0,8),2) + "." + parseInt(tempSubnetMask.substring(8,16),2) + "." + parseInt(tempSubnetMask.substring(16,24),2) + "." + parseInt(tempSubnetMask.substring(24,32),2);
		this.broadcastAddress = parseInt(broadcastAddressBinaryString.substring(0,8),2) + "." + parseInt(broadcastAddressBinaryString.substring(8,16),2) + "." + parseInt(broadcastAddressBinaryString.substring(16,24),2) + "." + parseInt(broadcastAddressBinaryString.substring(24,32),2);
	}
	
	//Description: Calculates subnet information for an IP address with a dotted decimal subnet mask
	//Prerequisites: ipAddress and dottedDecimalSubnetMask must have valid values
	//Outcomes: Calculates subnet information
	//Calls: None
	//Called by:object subnetInformation in function parse()
	this.calculateDottedDecimalInfo = function(ipAddress, dottedDecimalSubnetMask)
	{
		var tempSubnetMask = "";
		var networkAddressBinaryString = "";
		var broadcastAddressBinaryString = "";
		this.cidr = subnetInformation.validateDottedDecimalSubnetMask(dottedDecimalSubnetMask);
		var vlsm = parseInt(this.cidr.substring(1,this.cidr.length),10);
		
		//Calculate hosts per subnet
		if(vlsm <= 30)
		{
			this.hostsPerSubnet = Math.pow(2,(32-vlsm))-2 + "";
		}
		
		else
		{
			this.hostsPerSubnet = Math.pow(2,32-vlsm) + "";
		}
		this.bitsInNetwork = vlsm;
		this.bitsInHost = 32-vlsm;
		
		//Calculate Subnet Mask
		for(i = 0; i < vlsm; i++)
		{
			if(i == 0)
			{
				tempSubnetMask = "1";
			}
			
			else
			{
				tempSubnetMask = tempSubnetMask + "1";
			}
		}
		
		for(i = 0; i <(32-vlsm);i++)
		{
			tempSubnetMask = tempSubnetMask + "0";
		}
		//Calculate Network Address
		octets = ipAddress.split(".");
		var substringBase = 0;
		for(i = 0; i<4; i++)
		{
			var temp = parseInt(tempSubnetMask.substring(substringBase,substringBase + 8),2);
			var netAddressPart = temp & parseInt(octets[i],10);
			this.networkAddress += netAddressPart;
			networkAddressBinaryString += subnetInformation.formatString(parseInt(netAddressPart,2),8,"0");
			if(i != 3)
			{
				this.networkAddress += ".";
			}
			substringBase += 8;
		}
		
		//Calculate Broadcast Address
		for(i = 0; i<32; i++)
		{
			if(i<vlsm)
			{
				broadcastAddressBinaryString += networkAddressBinaryString.charAt(i);
			}
			else
			{
				broadcastAddressBinaryString += "1";
			}
		}
		this.subnetMask = parseInt(tempSubnetMask.substring(0,8),2) + "." + parseInt(tempSubnetMask.substring(8,16),2) + "." + parseInt(tempSubnetMask.substring(16,24),2) + "." + parseInt(tempSubnetMask.substring(24,32),2);
		this.broadcastAddress = parseInt(broadcastAddressBinaryString.substring(0,8),2) + "." + parseInt(broadcastAddressBinaryString.substring(8,16),2) + "." + parseInt(broadcastAddressBinaryString.substring(16,24),2) + "." + parseInt(broadcastAddressBinaryString.substring(24,32),2);
	
	}
	 
	//Description: Utility functions to validate IP Address
	//Prerequisites: None
	//Outcomes: Returns true if the IP address is valid and false otherwise
	//Calls:None
	//Called by: object subnetInformation in function parse()
	this.validateIPAddress = function(ipAddress)
	{
		try
		{
			var octets = ipAddress.split(".");
			if(ipAddress == null || ipAddress.length == 0)
			{
				return false;	
			}
					
			else if(ipAddress.charAt(ipAddress.length - 1) == ".")
			{
				return false; 
			}
					
			if(octets.length != 4)
			{
				return false;
			}
					
			for(i = 0; i < octets.length; i++)
			{
				if(isNaN(octets[i]))
				{
					return false;
				}
				else if(octets[i] > 255 || octets[i] <0)
				{
					return false;
				}
			}
		}
		catch(err)
		{
			return false;
		}
		return true;
	}
	
	//Description: Utility functions to validate VLSM
	//Prerequisites: None
	//Outcomes: Returns true if the VLSM is valid and false otherwise
	//Calls:None
	//Called by: object subnetInformation in function parse()
	this.validateVLSM = function(vlsm)
	{
		try
		{
			if(!parseInt(vlsm,10))
			{
				return false;
			}
				
			if(vlsm >= 1 && vlsm <= 32)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		catch(err)
		{
			return false;
		}
	}
	
	//Description: Utility functions to validate dotted decimal subnet mask
	//Prerequisites: None
	//Outcomes: Returns true if the dotted decimal subnet mask is valid and false otherwise
	//Calls:None
	//Called by: object subnetInformation in function parse()
	this.validateDottedDecimalSubnetMask = function(dottedDecimalSubnetMask)
	{
	    //Create an array of valid dotted decimal subnet masks
		var validDottedDecimalSubnetMasks = [];
		validDottedDecimalSubnetMasks[0] = "128.0.0.0";
		validDottedDecimalSubnetMasks[1] = "192.0.0.0";
		validDottedDecimalSubnetMasks[2] = "224.0.0.0";
		validDottedDecimalSubnetMasks[3] = "240.0.0.0";
		validDottedDecimalSubnetMasks[4] = "248.0.0.0";
		validDottedDecimalSubnetMasks[5] = "252.0.0.0";
		validDottedDecimalSubnetMasks[6] = "254.0.0.0";
		validDottedDecimalSubnetMasks[7] = "255.0.0.0";
		validDottedDecimalSubnetMasks[8] = "255.128.0.0";
		validDottedDecimalSubnetMasks[9] = "255.192.0.0";
		validDottedDecimalSubnetMasks[10] = "255.224.0.0";
		validDottedDecimalSubnetMasks[11] = "255.240.0.0";
		validDottedDecimalSubnetMasks[12] = "255.248.0.0";
		validDottedDecimalSubnetMasks[13] = "255.252.0.0";
		validDottedDecimalSubnetMasks[14] = "255.254.0.0";
		validDottedDecimalSubnetMasks[15] = "255.255.0.0";
		validDottedDecimalSubnetMasks[16] = "255.255.128.0";
		validDottedDecimalSubnetMasks[17] = "255.255.192.0";
		validDottedDecimalSubnetMasks[18] = "255.255.224.0";
		validDottedDecimalSubnetMasks[19] = "255.255.240.0";
		validDottedDecimalSubnetMasks[20] = "255.255.248.0";
		validDottedDecimalSubnetMasks[21] = "255.255.252.0";
		validDottedDecimalSubnetMasks[22] = "255.255.254.0";
		validDottedDecimalSubnetMasks[23] = "255.255.255.0";
		validDottedDecimalSubnetMasks[24] = "255.255.255.128";
		validDottedDecimalSubnetMasks[25] = "255.255.255.192";
		validDottedDecimalSubnetMasks[26] = "255.255.255.224";
		validDottedDecimalSubnetMasks[27] = "255.255.255.240";
		validDottedDecimalSubnetMasks[28] = "255.255.255.248";
		validDottedDecimalSubnetMasks[29] = "255.255.255.252";
		validDottedDecimalSubnetMasks[30] = "255.255.255.254";
		validDottedDecimalSubnetMasks[31] = "255.255.255.255";
		
		if(!this.validateIPAddress(dottedDecimalSubnetMask))
		{
			return "";
		}
		
		for(i = 0; i < 32; i++)
		{
			if(dottedDecimalSubnetMask == validDottedDecimalSubnetMasks[i])
			{
				var cidr = "\\" + (i + 1);
				return cidr;
			}
		}
		return "";
	 }
	 	
	//Description: Utility functions to append string with zeros at beginning
	//Prerequisites: None
	//Outcomes: Appends string with zeros at beginning
	//Calls:None
	//Called by: object subnetInformation in function parse()
	this.formatString = function(n, width, z) 
	{
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	} 
}

