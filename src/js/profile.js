

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init: function() 
    {
      return App.initWeb3();
    },
  
    initWeb3: function() 
    {
      if (typeof web3 !== 'undefined') 
      {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } 
      else 
      {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() 
    {
      $.getJSON("kidney.json", function(election) 
      {
        // Instantiate a new truffle contract from the artifact
        App.contracts.kidney = TruffleContract(election);
        // Connect provider to interact with contract
        App.contracts.kidney.setProvider(App.web3Provider);
  
        return App.profile();
      });
    },
    profile: function()
    {
        var kidneyInstance;
        var account;
        // Load account data
        web3.eth.getCoinbase(function(err, account) 
        {
            if (err === null) 
            {
            App.account = account;
            $("#account").html("Account Address: " + `${account.slice(0, 6)}...${account.slice(-6)}`);
            }
        });

        web3.eth.getAccounts(function(error, result)
        {
          if(error === null)
          {
            account=result[0];
            // $('#account').html("Your Account Address " +account);
          }
        });
    

        // App.contracts.kidney.deployed().then(function(instance) 
        // {
        //   console.log("Block Not found");
        //   return instance.Blocknotfound();
         
        // });

       

        App.contracts.kidney.deployed().then(function(instance)
        {
          kidneyInstance = instance;
          return kidneyInstance.gettotalcount();
        }).then(function(gettotalcount)
        {
          $("#trans1").html("Block is :"+gettotalcount);
          for (var i = 1; i <= gettotalcount; i++)
          {
          
            kidneyInstance.donation(i).then(function(donations) 
            {
              console.log(account)
              if(account == donations[3])
              {
                $('#don').html("Current: "+donations);
              
              
              
                
                // state donationstate;
                // uint matching_block;
                // uint month;
                var id   = i;
                console.log(id)


                var name = donations[0];
                var blood= donations[1]
                var city=  donations[2];
                var acc = donations[3];
                var mobiles= donations[4];
                var donor = donations[5];
                var hlas = donations[6];
                var state= donations[7];


                var block  = donations[8];
                var month  = donations[9];
                console.log(name)
                console.log(city)
                console.log(blood)
                console.log(acc)
                console.log(mobiles)
                console.log(state) //Donor
                console.log(hlas)
                console.log(donor)
                console.log(block)
                console.log(month)
                $("#names").html(" "+name);
                $("#blood").html(" "+blood);
                $("#city").html(""+city);
                $("#acc").html(" "+acc);
                $("#mobiles").html(" "+mobiles);
                $('#blockid').html(' '+id);
                if(state == 0)
                {
                  $("#state").html("Created");

                  App.contracts.kidney.deployed().then(function(instance) 
                  {
                    console.log("Block Not found");
                    return instance.Blocknotfound();
                   
                  });

                  App.contracts.kidney.deployed().then(function(instance) 
                  {
                    console.log("Block found");
                    return instance.blockfoundforloop();
                   
                  });

                  

                }
                else if(state == 1)
                {
                  $("#state").html("Not Found");
                }

                else if(state == 2)
                {
                  $("#state").html("Found");
                }
                
                $("#hlas").html(" "+hlas);
                $("#hla1").html(" "+hlas);

                console.log("Donor Value")
                console.log(donor);
                  if(donor== 1)
                  {
                    $("#donor").html("Donor");
                  }
                  else
                  {
                    $("#donor").html("Receiver");
                  }

                $("#block").html(" "+block);
                $("#month").html(" "+month);

              }
              var hlavalue = $("#hlavalue");
              hlavalue.empty();
                
              var ids = hlas;
              hlavalue.append(ids);
            });
          }
        });
    },


    updatehla: function() 
    {//store opening
      var p_name =$('#name').val();
      var blood_group=$('#blood_group').val();
      var city=$('#city').val();
      var mobile=$('#mobile').val();
      var door=$('#door').val();
      var hla=$('#hla').val();
      var month=$('#month').val();
  
      console.log("_________________________________________________________")
      console.log(p_name);
      console.log(blood_group);
      console.log(city);
      console.log(mobile);
      console.log(door);
      console.log(hla);
      console.log(month);
      console.log("___________________________________________________________")
  
    
      App.contracts.kidney.deployed().then(function(instance) 
      {
        return instance.storedata(p_name,blood_group,city,mobile,door,hla,month,{ from: App.account });
      }).then(function(result) {
        // Wait for votes to update
        // $("#content").hide();
        // $("#loader").show();
        console.log("Data is Stored ")
        console.log(result)
      }).catch(function(err) {
        console.error(err);
      });
  
      // App.contracts.kidney.deployed().then(function(instance) 
      // {
      //   console.log("Block Not found");
      //   return instance.Blocknotfound();
       
      // });
    }//store closing

  };
  
  $(function() {//function open
    $(window).load(function() {
      App.init();
    });
  });//Function Closing