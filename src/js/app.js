App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("kidney.json", function (election) {

      App.contracts.kidney = TruffleContract(election);

      App.contracts.kidney.setProvider(App.web3Provider);

      return App.render();
    });
  },


  render: function () {
    var kidneyInstance;
    var account;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Account Address: " + `${account.slice(0, 6)}...${account.slice(-6)}`);
      }
    });

    web3.eth.getAccounts(function (error, result) {
      if (error === null) {
        account = result[0];
        $('#account').html("Account Address " + `${account.slice(0, 6)}...${account.slice(-6)}`);
      }

    });



    web3.eth.getBlockNumber(function (err, value) {
      if (err === null) {
        App.value = value;
        $('#displayblock').html("Total Block:" + value);
      }
    });
    var j, tran;
    web3.eth.getTransactionCount(web3.eth.accounts[0], 'latest', (err, current) => {
      for (var i = 1; i <= current; i++) {
        web3.eth.getBlock(i, (err, res) => {
          tran = res.transactions
          $("#history").html("Block Number :" + tran + " Block hash  :" + res.hash + " Block Timestamp  :" + res.timestamp + " Parent Hash  :" + res.parentHash + " Gas :" + res.gasUsed + " Miner " + res.sha3Uncles);
          web3.eth.getTransaction(tran, (err, re) => {
            if (err === null && (re.from == account)) {
              $("#trans").html("Account is :" + re.from);
            }
          });

        })
      }
    });

    App.contracts.kidney.deployed().then(function (instance) {
      kidneyInstance = instance;
      return kidneyInstance.gettotalcount();
    }).then(function (gettotalcount) {
      $("#trans1").html("Block is :" + gettotalcount);
      var candidate = $("#candidate");
      candidate.empty();
      for (var i = 1; i <= gettotalcount; i++) {
        kidneyInstance.donation(i).then(function (donations) {

          var blood = donations[1];
          var city = donations[2];
          var acc = donations[3];
          var donor = donations[5];
          var hlas = donations[6];
          var state = donations[7];
          var block = donations[8];
          var month = donations[9];


          if (donor == 1) {
            var donor = 'Donor';
          }
          else {
            var donor = "Receiver";
          }

          if (state == 0) {
            var state = "Created";
          }
          else if (state == 1) {
            var state = "Not Found";
          }

          else if (state == 2) {
            var state = "Found";
          }

          var candidatetemp = "<tr><td>" + acc + "</td><td>" + blood + "</td><td>" + donor + "</td><td>" + hlas + "</td><td>" + city + "</td><td>" + state + "</td><td>" + block + "</td><td>" + month + "</td></tr>"
          candidate.append(candidatetemp)

          loader.hide();
          content.show();

        });
      }
    })
  },

  storedata: function () {
    var p_name = $('#name').val();
    var blood_group = $('#blood_group').val();
    var city = $('#city').val();
    var mobile = $('#mobile').val();
    var door = $('#door').val();
    var hla = $('#hla').val();
    var month = $('#month').val();

    App.contracts.kidney.deployed().then(function (instance) {
      return instance.storedata(p_name, blood_group, city, mobile, door, hla, month, { from: App.account });
    }).then(function (result) {

      console.log("Data is Stored ")
    }).catch(function (err) {
      console.error(err);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

function findMatch(data) {
  // Filter donors and receivers
  const donors = data.filter(person => person.DonorReceiver === "Donor");
  const receivers = data.filter(person => person.DonorReceiver === "Receiver");

  // Loop through receivers
  for (const receiver of receivers) {
    // Find a compatible donor
    for (const donor of donors) {
      if (
        receiver.BloodGroup === donor.BloodGroup &&
        receiver.HLA === donor.HLA &&
        receiver.City === donor.City
      ) {
        console.log("Perfect Match Found!");
        console.log(`Donor: ${donor.BloodGroup}, ${donor.HLA} - ${donor.City}`);
        console.log(`Receiver: ${receiver.BloodGroup}, ${receiver.HLA} - ${receiver.City}`);
        return 1; // Perfect match found
      }
    }
  }

  console.log("No perfect match found.");
  return 2; // No match found
}