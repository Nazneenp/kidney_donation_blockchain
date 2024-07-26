pragma solidity >=0.4.0 <=0.6.0;

contract kidney
{//Start contract
    struct Donation
    {
        string p_name;
        string blood_group;
        string city;
        address customer;
        uint256 mobile;
        uint door;
        string hla;
        state donationstate;
        uint matching_block;
        uint month;
        // uint timestamp;
    }
    
    enum state{Created, Notfound, Found}
    uint id;

    mapping(uint=>Donation) public donation;
    
    function storedata(string memory p_name,string memory blood_group, string memory city,uint256 mobile,uint door, string memory hla,uint month) public
    {
        id=id+1;
        uint matching_block=0;
        donation[id]=Donation(p_name,blood_group,city,msg.sender,mobile,door,hla,state.Created,matching_block,month);    
    }
    
    function updatedatahla(uint userid,string memory _hla) public
    {
        donation[userid].hla=_hla;
    }
    
    function updatematchblock(uint userid,uint _matching_block) public
    {
        donation[userid].matching_block=_matching_block;
    }
    
    function statefound(uint userid) public
    {
        donation[userid].donationstate=state.Found;
    }
    
    function statenotfound(uint userid) public
    {
        donation[userid].donationstate=state.Notfound;
    }
    
    function Blocknotfound() public
    {
        for(uint i=1;i<=id;i++)
        {
            Donation memory x=donation[i];
            if( x.month == 1)
            {
               
                if (block.timestamp > 1 seconds) 
                {
                    statenotfound(i);
                
                }
            
            }
            
            else if( x.month == 3)
            {
                if(block.timestamp < 90 days)
                {
                     statenotfound(i);
                }
            }
           
             
        }
       
    }
     
    // function matchinteger() public view returns(bool)
    // {
    //     for(uint i=1;i<=id;i++)
    //     {
    //         if(keccak256(abi.encodePacked(donation[i].door)) == 1)
    //         {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
    
    // function matchinteger1() public view returns(bool)
    // {
    //     for(uint i=1;i<=id;i++)
    //     {
    //         if(keccak256(abi.encodePacked(donation[i].door)) == '1')
    //         {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
    
    // function matchinteger12() public view returns(bool)
    // {
    //     for(uint i=1;i<=id;i++)
    //     {
    //       if(keccak256(abi.encodePacked(donation[i].door)) == '1')
    //         {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
    // function matchinteger123() public view returns(bool)
    // {
    //     for(uint i=1;i<=id;i++)
    //     {
    //         if((donation[i].door) ==  1)
    //         {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
    
    function gettotalcount() public view returns(uint)
    {
        return id;
    }
    
    function blockfoundforloop() public 
    {
      
      for(uint i=1;i<id;i++)
      {
        for(uint j=2;j<=id;j++)
        {
            if (keccak256(abi.encodePacked(donation[i].donationstate)) == keccak256(abi.encodePacked(state.Created)))
            {
               if((donation[i].door) ==  1)
                {
                      
                    if (keccak256(abi.encodePacked(donation[j].donationstate)) == keccak256(abi.encodePacked(state.Created)))
                    {
                        
                     if((donation[j].door) ==  0)
                      {
                         
                        if(keccak256(abi.encodePacked(donation[i].city)) == keccak256(abi.encodePacked(donation[j].city)))
                        {
                            
                          if (keccak256(abi.encodePacked(donation[i].blood_group)) == keccak256(abi.encodePacked(donation[j].blood_group)))  
                           {
                            
                            if( keccak256(abi.encodePacked(donation[i].hla)) == keccak256(abi.encodePacked(donation[j].hla)) )
                                {
                                    updatematchblock(i,j);//Update First Block
                                    updatematchblock(j,i);//Update Second Block
                                    statefound(i);//Update First Block State;
                                    statefound(j);//Update Second Block State;
                                           
                                }
                            }
                        }
                      }
                    }
                }
            }
        }
         
      }
    }
    
    
}//End of contract